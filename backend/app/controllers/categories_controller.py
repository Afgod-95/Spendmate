from flask import jsonify, request, g
from app.models.category_class import Category
from app.middlewares.auth_middleware import require_auth


@require_auth
def create_category(): 
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    type_ = data.get("type", "").strip()
    icon = data.get("icon", "").strip()
    user_id = g.user_id

    if not name or not type_:
        return jsonify({"error": "Category name and type are required"}), 400
    
    category = Category.create_category(
        name=name,
        type_=type_,
        icon=icon,
        user_id=user_id
    )

    return jsonify({"success": True, "category": category.__dict__}), 201



@require_auth
def delete_category(id): 
    data = request.get_json() or {}

    user_id = g.user_id

    if not id:
        return jsonify({"error": "Category ID is required"}), 400

    category = Category.delete_category(
        id=id,
        user_id=user_id
    )

    return jsonify({"success": True, "deleted": category.__dict__}), 200



@require_auth
def get_all_categories():
    user_id = g.user_id

    categories = Category.get_all_categories(user_id=user_id)
    return jsonify({
        "success": True, 
        "categories": [cat.__dict__ for cat in categories]
    }), 200
