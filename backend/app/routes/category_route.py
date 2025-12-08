from flask import Blueprint
from app.controllers.categories_controller import delete_category, create_category, get_all_categories

category_bp = Blueprint("category", __name__)


category_bp.route('/create-category', methods=['POST'])(create_category)
category_bp.route('/delete-category/<id>', methods=['DELETE'])(delete_category)
category_bp.route('/get-all-categories', methods=['GET'])(get_all_categories)


