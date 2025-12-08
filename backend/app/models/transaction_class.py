from app.supabase.supabase_client import supabase
from typing import Any, Dict, cast

class Transaction:
    def __init__(
        self, id=None, title=None, amount=None, payment_method=None, 
        category_id=None, type_=None, description=None, user_id=None, 
        created_at=None, document_url=None
    ):
        self.id = id
        self.title = title
        self.amount = amount
        self.payment_method = payment_method
        self.category_id = category_id
        self.type = type_
        self.description = description
        self.user_id = user_id
        self.created_at = created_at
        self.document_url = document_url

    @classmethod
    def create_transaction(cls, title, amount, payment_method, category_id, user_id, description=None, document_url=None):
        # Fetch category to know type
        res = supabase.table("categories").select("*").eq("id", category_id).eq("user_id", user_id).execute()
        raw_category = res.data[0] if res.data else None
        if not raw_category or not isinstance(raw_category, dict):
            raise ValueError("Category not found for this user")
        category = cast(Dict[str, Any], raw_category)

        type_ = category.get("type")
        if type_ is None:
            raise ValueError("Category type missing")

        data = {
            "title": title,
            "amount": amount,
            "payment_method": payment_method,
            "category_id": category_id,
            "type": type_,
            "description": description,
            "user_id": user_id,
            "document_url": document_url  # optional
        }

        res = supabase.table("transactions").insert(data).execute()
        raw_record = res.data[0] if res.data else None
        if not raw_record or not isinstance(raw_record, dict):
            raise ValueError("Failed to create transaction")
        record = cast(Dict[str, Any], raw_record)
        return cls(**record)

    @classmethod
    def get_all_transactions(cls, user_id):
        """Fetch all transactions for a user including category info"""
        res = supabase.table("transactions")\
            .select("id, title, amount, payment_method, description, document_url, type, created_at, category(id, name)")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .execute()
        
        transactions = res.data or []
        return [cls(**cast(Dict[str, Any], tx)) for tx in transactions]
    

    @classmethod
    def delete_transaction(cls, transaction_id, user_id):
        """Delete a transaction by ID for a specific user"""
        res = supabase.table("transactions")\
            .delete()\
            .eq("id", transaction_id)\
            .eq("user_id", user_id)\
            .execute()

        deleted = res.data[0] if res.data else None
        if not deleted:
            raise ValueError("Transaction not found or already deleted")
        return cls(**cast(Dict[str, Any], deleted))

    
    
    @classmethod
    def delete_all_transactions(cls, user_id):
        """Delete all transactions for a specific user"""
        res = supabase.table("transactions")\
            .delete()\
            .eq("user_id", user_id)\
            .execute()

        deleted_records = res.data or []
        return [cls(**cast(Dict[str, Any], record)) for record in deleted_records]


    @classmethod
    def get_totals(cls, user_id):
        """Returns totals per category, total income, total expense, and net balance"""
        res = supabase.table("transactions")\
            .select("amount, type, category_id, category(name)")\
            .eq("user_id", user_id).execute()
        
        transactions = res.data or []

        totals_per_category = {}
        total_income = 0
        total_expense = 0

        for tx in transactions:
            cat = tx.get("category") if isinstance(tx, dict) else None
            cat_name = cat.get("name", "Unknown") if isinstance(cat, dict) else "Unknown"
            totals_per_category.setdefault(cat_name, 0)

            amt = tx.get("amount", 0) if isinstance(tx, dict) else 0
            amount = amt if isinstance(amt, (int, float)) else 0
            totals_per_category[cat_name] += amount

            ttype = tx.get("type") if isinstance(tx, dict) else None
            if ttype == "income":
                total_income += amount
            else:
                total_expense += amount

        net_balance = total_income - total_expense

        return {
            "totals_per_category": totals_per_category,
            "total_income": total_income,
            "total_expense": total_expense,
            "net_balance": net_balance
        }
