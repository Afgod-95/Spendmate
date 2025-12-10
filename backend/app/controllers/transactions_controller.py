from app.models.transaction_class import Transaction
from flask import jsonify, request, g
from app.middlewares.auth_middleware import require_auth
from datetime import datetime, date


#------------- Create transaction ---------------- #
@require_auth
def create_transaction(): 
    """
    Create a new transaction for the authenticated user.
    
    Expected JSON body:
    {
        "title": "Grocery Shopping",
        "amount": 75.50,
        "payment_method": "credit_card",
        "category_id": "uuid-here",
        "description": "Optional description",
        "document_url": "Optional URL",
        "date": "2024-12-10"  # Optional, defaults to today
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        # Extract and validate required fields
        title = data.get("title", "").strip()
        amount = data.get("amount")
        payment_method = data.get("payment_method", "").strip()
        category_id = data.get("category_id", "").strip()
        
        # Optional fields
        description = data.get("description", "").strip() or None
        document_url = data.get("document_url", "").strip() or None
        date_str = data.get("date", "").strip()
        
        # Validate required fields
        if not title:
            return jsonify({"error": "Title is required"}), 400
        
        if not amount:
            return jsonify({"error": "Amount is required"}), 400
        
        try:
            amount = float(amount)
            if amount <= 0:
                return jsonify({"error": "Amount must be greater than 0"}), 400
        except (TypeError, ValueError):
            return jsonify({"error": "Amount must be a valid number"}), 400
        
        if not payment_method:
            return jsonify({"error": "Payment method is required"}), 400
        
        if not category_id:
            return jsonify({"error": "Category ID is required"}), 400
        
        # Parse date if provided
        transaction_date = None
        if date_str:
            try:
                transaction_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "Date must be in YYYY-MM-DD format"}), 400
        
        # Get authenticated user ID
        user_id = g.user_id
        
        # Create transaction
        transaction = Transaction.create_transaction(
            title=title,
            amount=amount,
            payment_method=payment_method,
            category_id=category_id,
            user_id=user_id,
            description=description,
            document_url=document_url,
            date_=transaction_date
        )
        
        return jsonify({
            "success": True, 
            "message": "Transaction created successfully", 
            "transaction": {
                "id": str(transaction.id),
                "title": transaction.title,
                "amount": float(transaction.amount) if transaction.amount is not None else 0,
                "payment_method": transaction.payment_method,
                "category_id": str(transaction.category_id),
                "type": transaction.type,
                "description": transaction.description,
                "document_url": transaction.document_url,
                "date": str(transaction.date) if transaction.date else None,
                "created_at": str(transaction.created_at)
            }
        }), 201
        
    except ValueError as e:
        return jsonify({
            "error": "Validation error", 
            "details": str(e)
        }), 400
    except RuntimeError as e:
        return jsonify({
            "error": "Failed to create transaction", 
            "details": str(e)
        }), 500
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred", 
            "details": str(e)
        }), 500


#------------- Update transaction ---------------- #
@require_auth
def update_transaction(transaction_id):
    """
    Update an existing transaction.
    
    Expected JSON body (all fields optional):
    {
        "title": "Updated title",
        "amount": 100.00,
        "payment_method": "debit_card",
        "category_id": "new-uuid",
        "description": "Updated description",
        "document_url": "Updated URL",
        "date": "2024-12-11"
    }
    """
    try:
        if not transaction_id:
            return jsonify({"error": "Transaction ID is required"}), 400
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        user_id = g.user_id
        
        # Extract optional update fields
        title = data.get("title", "").strip() or None
        amount = data.get("amount")
        payment_method = data.get("payment_method", "").strip() or None
        category_id = data.get("category_id", "").strip() or None
        description = data.get("description", "").strip() if "description" in data else None
        document_url = data.get("document_url", "").strip() if "document_url" in data else None
        date_str = data.get("date", "").strip()
        
        # Validate amount if provided
        if amount is not None:
            try:
                amount = float(amount)
                if amount <= 0:
                    return jsonify({"error": "Amount must be greater than 0"}), 400
            except (TypeError, ValueError):
                return jsonify({"error": "Amount must be a valid number"}), 400
        
        # Parse date if provided
        transaction_date = None
        if date_str:
            try:
                transaction_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "Date must be in YYYY-MM-DD format"}), 400
        
        # Update transaction
        updated_transaction = Transaction.update_transaction(
            transaction_id=transaction_id,
            user_id=user_id,
            title=title,
            amount=amount,
            payment_method=payment_method,
            category_id=category_id,
            description=description,
            document_url=document_url,
            date_=transaction_date
        )
        
        return jsonify({
            "success": True, 
            "message": "Transaction updated successfully", 
            "transaction": {
                "id": str(updated_transaction.id),
                "title": updated_transaction.title,
                "amount": float(updated_transaction.amount) if updated_transaction.amount is not None else 0,
                "payment_method": updated_transaction.payment_method,
                "category_id": str(updated_transaction.category_id),
                "type": updated_transaction.type,
                "description": updated_transaction.description,
                "document_url": updated_transaction.document_url,
                "date": str(updated_transaction.date) if updated_transaction.date else None,
                "updated_at": str(updated_transaction.created_at)
            }
        }), 200
        
    except ValueError as e:
        return jsonify({
            "error": "Validation error", 
            "details": str(e)
        }), 400
    except RuntimeError as e:
        return jsonify({
            "error": "Failed to update transaction", 
            "details": str(e)
        }), 500
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred", 
            "details": str(e)
        }), 500


#------------- Get all transactions ---------------- #
@require_auth
def get_all_transactions():
    """
    Get all transactions for the authenticated user.
    
    Query parameters:
    - limit: Optional limit on number of results (e.g., ?limit=50)
    - type: Optional filter by type (e.g., ?type=income or ?type=expense)
    - start_date: Optional start date (e.g., ?start_date=2024-01-01)
    - end_date: Optional end date (e.g., ?end_date=2024-12-31)
    """
    try:
        user_id = g.user_id
        
        # Get query parameters
        limit = request.args.get("limit", type=int)
        type_filter = request.args.get("type", "").strip()
        start_date_str = request.args.get("start_date", "").strip()
        end_date_str = request.args.get("end_date", "").strip()
        
        # Parse dates if provided
        start_date = None
        end_date = None
        
        if start_date_str:
            try:
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "start_date must be in YYYY-MM-DD format"}), 400
        
        if end_date_str:
            try:
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "end_date must be in YYYY-MM-DD format"}), 400
        
        # Get transactions based on filters
        if start_date and end_date:
            transactions = Transaction.get_transactions_by_date_range(user_id, start_date, end_date)
        elif type_filter:
            if type_filter not in ["income", "expense"]:
                return jsonify({"error": "Type must be 'income' or 'expense'"}), 400
            transactions = Transaction.get_transactions_by_type(user_id, type_filter)
        else:
            transactions = Transaction.get_all_transactions(user_id, limit=limit)
        
        # Format response
        transactions_data = []
        for tx in transactions:
            tx_dict = {
                "id": str(tx.id),
                "title": tx.title,
                "amount": float(tx.amount) if tx.amount is not None else 0,
                "payment_method": tx.payment_method,
                "category_id": str(tx.category_id),
                "type": tx.type,
                "description": tx.description,
                "document_url": tx.document_url,
                "date": str(tx.date) if tx.date else None,
                "created_at": str(tx.created_at)
            }
            
            # Add category info if available
            if hasattr(tx, 'category') and tx.category:
                tx_dict["category"] = tx.category
            
            transactions_data.append(tx_dict)
        
        return jsonify({
            "success": True,
            "message": "Transactions retrieved successfully",
            "count": len(transactions_data),
            "transactions": transactions_data
        }), 200
        
    except ValueError as e:
        return jsonify({
            "error": "Validation error", 
            "details": str(e)
        }), 400
    except RuntimeError as e:
        return jsonify({
            "error": "Failed to retrieve transactions", 
            "details": str(e)
        }), 500
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred", 
            "details": str(e)
        }), 500


#------------- Get single transaction ---------------- #
@require_auth
def get_transaction(transaction_id):
    """Get a specific transaction by ID."""
    try:
        if not transaction_id:
            return jsonify({"error": "Transaction ID is required"}), 400
        
        user_id = g.user_id
        transaction = Transaction.get_transaction_by_id(transaction_id, user_id)
        
        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404
        
        return jsonify({
            "success": True,
            "message": "Transaction retrieved successfully",
            "transaction": {
                "id": str(transaction.id),
                "title": transaction.title,
                "amount": float(transaction.amount) if transaction.amount is not None else 0,
                "payment_method": transaction.payment_method,
                "category_id": str(transaction.category_id),
                "type": transaction.type,
                "description": transaction.description,
                "document_url": transaction.document_url,
                "date": str(transaction.date) if transaction.date else None,
                "created_at": str(transaction.created_at),
                "category": transaction.category if hasattr(transaction, 'category') else None
            }
        }), 200
        
    except RuntimeError as e:
        return jsonify({
            "error": "Failed to retrieve transaction", 
            "details": str(e)
        }), 500
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred", 
            "details": str(e)
        }), 500


#------------- Delete transaction ---------------- #
@require_auth
def delete_transaction(transaction_id):
    """Delete a specific transaction."""
    try:
        if not transaction_id:
            return jsonify({"error": "Transaction ID is required"}), 400
        
        user_id = g.user_id
        deleted_transaction = Transaction.delete_transaction(transaction_id, user_id)
        
        return jsonify({
            "success": True, 
            "message": f"Transaction deleted successfully",
            "deleted_transaction": {
                "id": str(deleted_transaction.id),
                "title": deleted_transaction.title,
                "amount": float(deleted_transaction.amount) if deleted_transaction.amount is not None else 0
            }
        }), 200
        
    except RuntimeError as e:
        return jsonify({
            "error": "Failed to delete transaction", 
            "details": str(e)
        }), 404
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred", 
            "details": str(e)
        }), 500


#------------- Delete all transactions ---------------- #
@require_auth
def delete_all_transactions(): 
    """
    Delete all transactions for the authenticated user.
    WARNING: This is a destructive operation!
    """
    try:
        user_id = g.user_id
        deleted_transactions = Transaction.delete_all_transactions(user_id)
        
        return jsonify({
            "success": True, 
            "message": f"All transactions deleted successfully",
            "deleted_count": len(deleted_transactions)
        }), 200
        
    except RuntimeError as e:
        return jsonify({
            "error": "Failed to delete transactions", 
            "details": str(e)
        }), 500
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred", 
            "details": str(e)
        }), 500


#------------- Get financial totals ---------------- #
@require_auth
def get_totals():
    """
    Get financial summary for the authenticated user.
    
    Query parameters:
    - start_date: Optional start date (e.g., ?start_date=2024-01-01)
    - end_date: Optional end date (e.g., ?end_date=2024-12-31)
    """
    try:
        user_id = g.user_id
        
        # Get query parameters for date filtering
        start_date_str = request.args.get("start_date", "").strip()
        end_date_str = request.args.get("end_date", "").strip()
        
        start_date = None
        end_date = None
        
        if start_date_str:
            try:
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "start_date must be in YYYY-MM-DD format"}), 400
        
        if end_date_str:
            try:
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "end_date must be in YYYY-MM-DD format"}), 400
        
        # Get totals with optional date filtering
        totals = Transaction.get_totals(user_id, start_date, end_date)
        
        return jsonify({
            "success": True, 
            "message": "Financial summary retrieved successfully", 
            "totals": totals,
            "filters": {
                "start_date": str(start_date) if start_date else None,
                "end_date": str(end_date) if end_date else None
            }
        }), 200
        
    except RuntimeError as e:
        return jsonify({
            "error": "Failed to retrieve totals", 
            "details": str(e)
        }), 500
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred", 
            "details": str(e)
        }), 500


#------------- Get monthly summary ---------------- #
@require_auth
def get_monthly_summary():
    """
    Get financial summary for a specific month.
    
    Query parameters:
    - year: Year (e.g., ?year=2024)
    - month: Month (e.g., ?month=12)
    
    If not provided, defaults to current month.
    """
    try:
        user_id = g.user_id
        
        # Get query parameters
        year = request.args.get("year", type=int)
        month = request.args.get("month", type=int)
        
        # Default to current month if not provided
        if not year or not month:
            now = datetime.now()
            year = now.year
            month = now.month
        
        # Validate month
        if month < 1 or month > 12:
            return jsonify({"error": "Month must be between 1 and 12"}), 400
        
        # Get monthly summary
        summary = Transaction.get_monthly_summary(user_id, year, month)
        
        return jsonify({
            "success": True,
            "message": f"Monthly summary retrieved successfully",
            "year": year,
            "month": month,
            "summary": summary
        }), 200
        
    except RuntimeError as e:
        return jsonify({
            "error": "Failed to retrieve monthly summary", 
            "details": str(e)
        }), 500
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred", 
            "details": str(e)
        }), 500