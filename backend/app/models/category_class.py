from app.supabase.supabase_client import supabase

class Category: 
    def __init__(self, id=None, name=None, type_=None, icon=None, user_id=None):
        self.id = id 
        self.name = name
        self.type = type_    # FIX: rename for consistency
        self.icon = icon
        self.user_id = user_id
    

    #------------- create category ---------------- #
    @classmethod
    def create_category(cls, name, type_, icon, user_id):
        if type_ not in ["income", "expense"]:
            raise ValueError("Type must be 'income' or 'expense'")

        data = {
            "name": name,
            "type": type_,
            "icon": icon,
            "user_id": user_id
        }

        res = supabase.table("categories").insert(data).execute()

        records = getattr(res, "data", None)
        if not records:
            raise RuntimeError("Failed to create category; no data returned from supabase")

        return cls(**records[0])
    


    #------------- Delete category ---------------- #
    @classmethod 
    def delete_category(cls, id, user_id):
        res = (
            supabase
            .table("categories")
            .delete()
            .eq("id", id)
            .eq("user_id", user_id)
            .execute()
        )

        records = getattr(res, "data", None)
        if not records:
            raise RuntimeError("Failed to delete category or category not found")

        return cls(**records[0])
    

    #------------- Get all categories ---------------- #
    @classmethod
    def get_all_categories(cls, user_id):
        # fetch categories user created + default categories (user_id NULL)
        res = (
            supabase
            .table("categories")
            .select("*")
            .or_(f"user_id.eq.{user_id},user_id.is.null")
            .execute()
        )

        records = getattr(res, "data", None)
        if records is None:
            raise RuntimeError("Failed to get categories")

        return [cls(**record) for record in records]
