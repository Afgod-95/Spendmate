from app.models.transaction_class import Transaction
from flask import jsonify, request, g
from app.middlewares.auth_middleware import require_auth



@require_auth
def create_transaction(): 
    data = request.get_json()
    title = data.get("title", "").strip()
    amount = data.get("amount", 0.0).strip()
    payment_method = data.get("payment_method", "").strip()
    category_id = data.get("category_id", "").strip()
    category = data.get("category", "").strip()
    description = data.get("description", "").strip()
    transaction_type = data.get("transaction_type", "").strip()
    document_url = data.get("document_url", "").strip()
    user_id = g.user_id

    required_fields = [
        title, amount, payment_method, category_id, category, 
         transaction_type
    ]

    if not required_fields: 
        return jsonify({"error": "Title, Amount, Payment Method, Category, Transaction Type are required "}), 400
    
    transaction = Transaction.create_transaction(
        title = title,
        amount = amount,
        payment_method = payment_method,
        category_id = category_id,
        user_id= user_id,
        description= description,
        document_url = document_url
    )

    return jsonify({"success": True, "Transaction created sucessfully": transaction}), 201
    


