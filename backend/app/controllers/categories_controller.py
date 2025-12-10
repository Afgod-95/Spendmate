from flask import jsonify, request, g
from app.models.category_class import Category
from app.middlewares.auth_middleware import require_auth


@require_auth
def create_category(): 
    try:
        data = request.get_json() or {}

        name = (data.get("name") or "").strip()
        type_ = (data.get("type") or "").strip()
        icon = (data.get("icon") or "").strip()
        user_id = g.user_id

        if not name or not type_:
            return jsonify({"error": "Category name and type are required"}), 400
        
        category = Category.create_category(
            name=name,
            type=type_,  # matches Category.create_category signature
            icon=icon,
            user_id=user_id
        )

        return jsonify({"success": True, "category": category.__dict__}), 201

    except ValueError as e:
        print(f"Create category error: {str(e)}")
        return jsonify({
            "error": "Invalid input while creating category",
            "details": str(e)
        }), 400

    except RuntimeError as e:
        print(f"Create category runtime error: {str(e)}")
        return jsonify({
            "error": "Failed to create category",
            "details": str(e)
        }), 500

    except Exception as e:
        print(f"Unexpected error in create_category: {str(e)}")
        return jsonify({
            "error": "Unexpected error occurred",
            "details": str(e)
        }), 500


@require_auth
def delete_category(id): 
    try:
        user_id = g.user_id

        if not id:
            return jsonify({"error": "Category ID is required"}), 400

        category = Category.delete_category(
            id=id,
            user_id=user_id
        )

        return jsonify({"success": True, "deleted": category.__dict__}), 200

    except ValueError as e:
        print(f"Delete category error: {str(e)}")
        return jsonify({
            "error": "Cannot delete category",
            "details": str(e)
        }), 400

    except RuntimeError as e:
        print(f"Delete category runtime error: {str(e)}")
        return jsonify({
            "error": "Failed to delete category",
            "details": str(e)
        }), 500

    except Exception as e:
        print(f"Unexpected error in delete_category: {str(e)}")
        return jsonify({
            "error": "Unexpected error occurred",
            "details": str(e)
        }), 500


@require_auth
def get_all_categories():
    try:
        user_id = g.user_id

        categories = Category.get_all_categories(user_id=user_id)
        return jsonify({
            "success": True, 
            "categories": [cat.__dict__ for cat in categories]
        }), 200

    except RuntimeError as e:
        print(f"Get all categories runtime error: {str(e)}")
        return jsonify({
            "error": "Failed to fetch categories",
            "details": str(e)
        }), 500

    except Exception as e:
        print(f"Unexpected error in get_all_categories: {str(e)}")
        return jsonify({
            "error": "Unexpected error occurred",
            "details": str(e)
        }), 500
