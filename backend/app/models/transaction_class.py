from app.supabase.supabase_client import supabase
from typing import Any, Dict, List, Optional, cast
from datetime import datetime, date

class Transaction:
    def __init__(
        self, id=None, title=None, amount=None, payment_method=None, 
        category_id=None, type_=None, description=None, user_id=None, 
        created_at=None, document_url=None, date_=None, category=None
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
        self.date = date_
        self.category = category  # For nested category data


    #------------- Create transaction ---------------- #
    @classmethod
    def create_transaction(
        cls, 
        title: str, 
        amount: float, 
        payment_method: str, 
        category_id: str, 
        user_id: str, 
        description: Optional[str] = None, 
        document_url: Optional[str] = None,
        date_: Optional[date] = None
    ):
        """
        Create a new transaction.
        
        Args:
            title: Transaction title
            amount: Transaction amount (positive number)
            payment_method: Payment method (e.g., 'cash', 'card', 'bank_transfer')
            category_id: Category UUID
            user_id: User ID from Supabase Auth
            description: Optional description
            document_url: Optional document/receipt URL
            date_: Transaction date (defaults to today)
            
        Returns:
            Transaction instance
            
        Raises:
            ValueError: If validation fails or category not found
            RuntimeError: If database operation fails
        """
        # Validate amount
        if amount <= 0:
            raise ValueError("Amount must be greater than 0")
        
        # Validate category exists and user has access to it
        try:
            cat_res = (
                supabase
                .table("categories")
                .select("*")
                .eq("id", category_id)
                .or_(f"user_id.eq.{user_id},user_id.is.null")
                .execute()
            )
            
            if not cat_res.data:
                raise ValueError(
                    f"Category not found or you don't have access to it"
                )
            
            category = cast(Dict[str, Any], cat_res.data[0])
            type_ = category.get("type")
            
            if type_ not in ["income", "expense"]:
                raise ValueError("Invalid category type")
                
        except ValueError:
            raise
        except Exception as e:
            raise RuntimeError(f"Failed to validate category: {str(e)}")

        # Prepare transaction data
        data = {
            "title": title,
            "amount": float(amount),
            "payment_method": payment_method,
            "category_id": category_id,
            "type": type_,
            "description": description,
            "user_id": user_id,
            "document_url": document_url,
            "date": date_.isoformat() if date_ else None
        }

        try:
            res = supabase.table("transactions").insert(data).execute()
            
            if not res.data:
                raise RuntimeError("Failed to create transaction; no data returned")
            
            record = cast(Dict[str, Any], res.data[0])
            return cls(**record)
        except Exception as e:
            raise RuntimeError(f"Failed to create transaction: {str(e)}")


    #------------- Update transaction ---------------- #
    @classmethod
    def update_transaction(
        cls,
        transaction_id: str,
        user_id: str,
        title: Optional[str] = None,
        amount: Optional[float] = None,
        payment_method: Optional[str] = None,
        category_id: Optional[str] = None,
        description: Optional[str] = None,
        document_url: Optional[str] = None,
        date_: Optional[date] = None
    ):
        """
        Update an existing transaction.
        
        Args:
            transaction_id: Transaction UUID
            user_id: User ID (ensures user owns the transaction)
            title: New title (optional)
            amount: New amount (optional)
            payment_method: New payment method (optional)
            category_id: New category ID (optional)
            description: New description (optional)
            document_url: New document URL (optional)
            date_: New date (optional)
            
        Returns:
            Updated Transaction instance
            
        Raises:
            ValueError: If validation fails
            RuntimeError: If transaction not found or update fails
        """
        # Build update dict
        updates = {}
        if title is not None:
            updates["title"] = title
        if amount is not None:
            if amount <= 0:
                raise ValueError("Amount must be greater than 0")
            updates["amount"] = float(amount)
        if payment_method is not None:
            updates["payment_method"] = payment_method
        if description is not None:
            updates["description"] = description
        if document_url is not None:
            updates["document_url"] = document_url
        if date_ is not None:
            updates["date"] = date_.isoformat()
        
        # If category is being updated, validate it and update type
        if category_id is not None:
            try:
                cat_res = (
                    supabase
                    .table("categories")
                    .select("*")
                    .eq("id", category_id)
                    .or_(f"user_id.eq.{user_id},user_id.is.null")
                    .execute()
                )
                
                if not cat_res.data:
                    raise ValueError("Category not found or you don't have access to it")
                
                category = cast(Dict[str, Any], cat_res.data[0])
                updates["category_id"] = category_id
                updates["type"] = category.get("type")
            except ValueError:
                raise
            except Exception as e:
                raise RuntimeError(f"Failed to validate category: {str(e)}")
        
        if not updates:
            raise ValueError("No fields to update")
        
        try:
            res = (
                supabase
                .table("transactions")
                .update(updates)
                .eq("id", transaction_id)
                .eq("user_id", user_id)
                .execute()
            )
            
            if not res.data:
                raise RuntimeError(
                    f"Transaction with id={transaction_id} not found or "
                    f"does not belong to user"
                )
            
            record = cast(Dict[str, Any], res.data[0])
            return cls(**record)
        except Exception as e:
            raise RuntimeError(f"Failed to update transaction: {str(e)}")


    #------------- Get all transactions ---------------- #
    @classmethod
    def get_all_transactions(cls, user_id: str, limit: Optional[int] = None):
        """
        Fetch all transactions for a user including category info.
        
        Args:
            user_id: User ID from Supabase Auth
            limit: Optional limit on number of results
            
        Returns:
            List of Transaction instances
            
        Raises:
            RuntimeError: If query fails
        """
        try:
            query = (
                supabase
                .table("transactions")
                .select("*, categories(id, name, type, icon)")
                .eq("user_id", user_id)
                .order("date", desc=True)
                .order("created_at", desc=True)
            )
            
            if limit:
                query = query.limit(limit)
            
            res = query.execute()
            transactions = res.data or []
            
            # Flatten nested category data
            result = []
            for tx in transactions:
                tx_dict = cast(Dict[str, Any], tx)
                # Rename 'categories' to 'category' for consistency
                if "categories" in tx_dict:
                    tx_dict["category"] = tx_dict.pop("categories")
                result.append(cls(**tx_dict))
            
            return result
        except Exception as e:
            raise RuntimeError(f"Failed to get transactions: {str(e)}")


    #------------- Get transactions by date range ---------------- #
    @classmethod
    def get_transactions_by_date_range(
        cls, 
        user_id: str, 
        start_date: date, 
        end_date: date
    ):
        """
        Get transactions within a date range.
        
        Args:
            user_id: User ID
            start_date: Start date (inclusive)
            end_date: End date (inclusive)
            
        Returns:
            List of Transaction instances
        """
        try:
            res = (
                supabase
                .table("transactions")
                .select("*, categories(id, name, type, icon)")
                .eq("user_id", user_id)
                .gte("date", start_date.isoformat())
                .lte("date", end_date.isoformat())
                .order("date", desc=True)
                .execute()
            )
            
            transactions = res.data or []
            result = []
            for tx in transactions:
                tx_dict = cast(Dict[str, Any], tx)
                if "categories" in tx_dict:
                    tx_dict["category"] = tx_dict.pop("categories")
                result.append(cls(**tx_dict))
            
            return result
        except Exception as e:
            raise RuntimeError(f"Failed to get transactions by date: {str(e)}")


    #------------- Get transactions by type ---------------- #
    @classmethod
    def get_transactions_by_type(cls, user_id: str, type_: str):
        """
        Get transactions filtered by type (income or expense).
        
        Args:
            user_id: User ID
            type_: 'income' or 'expense'
            
        Returns:
            List of Transaction instances
        """
        if type_ not in ["income", "expense"]:
            raise ValueError("Type must be 'income' or 'expense'")
        
        try:
            res = (
                supabase
                .table("transactions")
                .select("*, categories(id, name, type, icon)")
                .eq("user_id", user_id)
                .eq("type", type_)
                .order("date", desc=True)
                .execute()
            )
            
            transactions = res.data or []
            result = []
            for tx in transactions:
                tx_dict = cast(Dict[str, Any], tx)
                if "categories" in tx_dict:
                    tx_dict["category"] = tx_dict.pop("categories")
                result.append(cls(**tx_dict))
            
            return result
        except Exception as e:
            raise RuntimeError(f"Failed to get transactions by type: {str(e)}")


    #------------- Get single transaction ---------------- #
    @classmethod
    def get_transaction_by_id(cls, transaction_id: str, user_id: str):
        """
        Get a specific transaction by ID.
        
        Args:
            transaction_id: Transaction UUID
            user_id: User ID
            
        Returns:
            Transaction instance or None
        """
        try:
            res = (
                supabase
                .table("transactions")
                .select("*, categories(id, name, type, icon)")
                .eq("id", transaction_id)
                .eq("user_id", user_id)
                .execute()
            )
            
            if not res.data:
                return None
            
            tx_dict = cast(Dict[str, Any], res.data[0])
            if "categories" in tx_dict:
                tx_dict["category"] = tx_dict.pop("categories")
            
            return cls(**tx_dict)
        except Exception as e:
            raise RuntimeError(f"Failed to get transaction: {str(e)}")


    #------------- Delete transaction ---------------- #
    @classmethod
    def delete_transaction(cls, transaction_id: str, user_id: str):
        """
        Delete a transaction by ID for a specific user.
        
        Args:
            transaction_id: Transaction UUID
            user_id: User ID
            
        Returns:
            Deleted Transaction instance
            
        Raises:
            RuntimeError: If transaction not found or delete fails
        """
        try:
            res = (
                supabase
                .table("transactions")
                .delete()
                .eq("id", transaction_id)
                .eq("user_id", user_id)
                .execute()
            )

            if not res.data:
                raise RuntimeError(
                    f"Transaction with id={transaction_id} not found or "
                    f"does not belong to user"
                )
            
            record = cast(Dict[str, Any], res.data[0])
            return cls(**record)
        except Exception as e:
            raise RuntimeError(f"Failed to delete transaction: {str(e)}")


    #------------- Delete all transactions ---------------- #
    @classmethod
    def delete_all_transactions(cls, user_id: str):
        """
        Delete all transactions for a specific user.
        WARNING: This is a destructive operation!
        
        Args:
            user_id: User ID
            
        Returns:
            List of deleted Transaction instances
        """
        try:
            res = (
                supabase
                .table("transactions")
                .delete()
                .eq("user_id", user_id)
                .execute()
            )

            deleted_records = res.data or []
            return [cls(**cast(Dict[str, Any], record)) for record in deleted_records]
        except Exception as e:
            raise RuntimeError(f"Failed to delete all transactions: {str(e)}")


    #------------- Get financial totals ---------------- #
    @classmethod
    def get_totals(cls, user_id: str, start_date: Optional[date] = None, end_date: Optional[date] = None):
        """
        Returns totals per category, total income, total expense, and net balance.
        
        Args:
            user_id: User ID
            start_date: Optional start date for filtering
            end_date: Optional end date for filtering
            
        Returns:
            Dictionary with financial summary
        """
        try:
            query = (
                supabase
                .table("transactions")
                .select("amount, type, category_id, categories(name, type, icon)")
                .eq("user_id", user_id)
            )
            
            # Add date filters if provided
            if start_date:
                query = query.gte("date", start_date.isoformat())
            if end_date:
                query = query.lte("date", end_date.isoformat())
            
            res = query.execute()
            transactions = res.data or []

            totals_per_category = {}
            total_income = 0.0
            total_expense = 0.0
            
            # Also track by type for summary
            income_by_category = {}
            expense_by_category = {}

            for tx in transactions:
                if not isinstance(tx, dict):
                    continue
                
                # Get category info
                cat = tx.get("categories")
                cat_name = cat.get("name", "Unknown") if isinstance(cat, dict) else "Unknown"
                
                # Get amount
                amt = tx.get("amount", 0)
                amount = float(amt) if isinstance(amt, (int, float)) else 0.0
                
                # Get type
                tx_type = tx.get("type")
                
                # Add to category totals
                if cat_name not in totals_per_category:
                    totals_per_category[cat_name] = {
                        "total": 0.0,
                        "type": tx_type,
                        "icon": cat.get("icon") if isinstance(cat, dict) else None
                    }
                totals_per_category[cat_name]["total"] += amount
                
                # Add to income/expense totals
                if tx_type == "income":
                    total_income += amount
                    income_by_category[cat_name] = income_by_category.get(cat_name, 0.0) + amount
                else:
                    total_expense += amount
                    expense_by_category[cat_name] = expense_by_category.get(cat_name, 0.0) + amount

            net_balance = total_income - total_expense

            return {
                "totals_per_category": totals_per_category,
                "income_by_category": income_by_category,
                "expense_by_category": expense_by_category,
                "total_income": round(total_income, 2),
                "total_expense": round(total_expense, 2),
                "net_balance": round(net_balance, 2),
                "transaction_count": len(transactions)
            }
        except Exception as e:
            raise RuntimeError(f"Failed to get totals: {str(e)}")


    #------------- Get monthly summary ---------------- #
    @classmethod
    def get_monthly_summary(cls, user_id: str, year: int, month: int):
        """
        Get financial summary for a specific month.
        
        Args:
            user_id: User ID
            year: Year (e.g., 2024)
            month: Month (1-12)
            
        Returns:
            Dictionary with monthly summary
        """
        from calendar import monthrange
        
        # Get first and last day of the month
        start_date = date(year, month, 1)
        last_day = monthrange(year, month)[1]
        end_date = date(year, month, last_day)
        
        return cls.get_totals(user_id, start_date, end_date)


    def __repr__(self):
        """String representation for debugging."""
        return (
            f"Transaction(id={self.id}, title='{self.title}', "
            f"amount={self.amount}, type='{self.type}', "
            f"date={self.date}, user_id={self.user_id})"
        )