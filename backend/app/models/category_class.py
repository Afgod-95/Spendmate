from app.supabase.supabase_client import supabase

class Category:
    def __init__(self, id=None, name=None, type=None, icon=None, user_id=None):
        self.id = id
        self.name = name
        self.type = type  # income or expense
        self.icon = icon
        self.user_id = user_id

    # ---------------- Create ---------------- #
    @classmethod
    def create_category(cls, name, type, icon, user_id):
        if type not in ["income", "expense"]:
            raise ValueError("Type must be 'income' or 'expense'")

        data = {"name": name, "type": type, "icon": icon, "user_id": user_id}

        try:
            res = supabase.table("categories").insert(data).execute()
        except Exception as e:
            # Catch unique constraint violation
            if "unique_user_category" in str(e).lower():
                raise ValueError(f"Category '{name}' of type '{type}' already exists for this user")
            raise RuntimeError(f"Failed to insert category: {str(e)}")

        records = getattr(res, "data", None)
        if not records:
            raise RuntimeError("No data returned from Supabase after insert")

        record_dict = {k: getattr(records[0], k) for k in records[0].__dict__ if not k.startswith("_")}
        return cls(**record_dict)

    # ---------------- Update ---------------- #
    @classmethod
    def update_category(cls, id, user_id, name=None, icon=None):
        updates = {}
        if name:
            updates["name"] = name
        if icon:
            updates["icon"] = icon

        if not updates:
            raise ValueError("No fields to update")

        # Fetch category to verify ownership
        try:
            cat = supabase.table("categories").select("user_id").eq("id", id).execute()
        except Exception as e:
            raise RuntimeError(f"Failed to fetch category: {str(e)}")

        if not cat.data:
            raise RuntimeError(f"Category with id={id} not found")

        record_user_id = getattr(cat.data[0], "user_id", None)
        if record_user_id is None:
            raise ValueError("Cannot update default categories")
        if record_user_id != user_id:
            raise RuntimeError("Category does not belong to user")

        # Perform update
        try:
            res = supabase.table("categories").update(updates).eq("id", id).eq("user_id", user_id).execute()
        except Exception as e:
            # Catch unique constraint violation
            if "unique_user_category" in str(e).lower():
                raise ValueError("Category with this name and type already exists for this user")
            raise RuntimeError(f"Failed to update category: {str(e)}")

        if not getattr(res, "data", None):
            raise RuntimeError("Update failed; no data returned")

        record_dict = {k: getattr(res.data[0], k) for k in res.data[0].__dict__ if not k.startswith("_")}
        return cls(**record_dict)

    # ---------------- Delete ---------------- #
    @classmethod
    def delete_category(cls, id, user_id):
        # Fetch category to verify ownership
        try:
            cat = supabase.table("categories").select("user_id").eq("id", id).execute()
        except Exception as e:
            raise RuntimeError(f"Failed to fetch category: {str(e)}")

        if not cat.data:
            raise RuntimeError(f"Category with id={id} not found")

        record_user_id = getattr(cat.data[0], "user_id", None)
        if record_user_id is None:
            raise ValueError("Cannot delete default categories")
        if record_user_id != user_id:
            raise RuntimeError("Category does not belong to user")

        # Check if category is referenced by transactions
        try:
            transactions = supabase.table("transactions").select("id").eq("category_id", id).execute()
            if transactions.data and len(transactions.data) > 0:
                raise ValueError(f"Cannot delete category; {len(transactions.data)} transaction(s) reference it")
        except ValueError:
            raise
        except Exception:
            pass  # ignore if transactions table does not exist

        # Perform deletion
        try:
            res = supabase.table("categories").delete().eq("id", id).eq("user_id", user_id).execute()
        except Exception as e:
            raise RuntimeError(f"Failed to delete category: {str(e)}")

        if not getattr(res, "data", None):
            raise RuntimeError("Delete failed; no data returned")

        record_dict = {k: getattr(res.data[0], k) for k in res.data[0].__dict__ if not k.startswith("_")}
        return cls(**record_dict)

    # ---------------- Get all categories ---------------- #
    @classmethod
    def get_all_categories(cls, user_id):
        try:
            res = supabase.table("categories").select("*").or_(f"user_id.eq.{user_id},user_id.is.null").execute()
        except Exception as e:
            raise RuntimeError(f"Failed to fetch categories: {str(e)}")

        records = getattr(res, "data", None)
        if not records:
            return []

        return [cls(**{k: getattr(r, k) for k in r.__dict__ if not k.startswith("_")}) for r in records]

    # ---------------- Get category by ID ---------------- #
    @classmethod
    def get_category_by_id(cls, id, user_id):
        try:
            res = supabase.table("categories").select("*").eq("id", id).or_(f"user_id.eq.{user_id},user_id.is.null").execute()
        except Exception as e:
            raise RuntimeError(f"Failed to fetch category: {str(e)}")

        records = getattr(res, "data", None)
        if not records:
            return None

        record_dict = {k: getattr(records[0], k) for k in records[0].__dict__ if not k.startswith("_")}
        return cls(**record_dict)

    def __repr__(self):
        return f"Category(id={self.id}, name='{self.name}', type='{self.type}', icon='{self.icon}', user_id={self.user_id})"
