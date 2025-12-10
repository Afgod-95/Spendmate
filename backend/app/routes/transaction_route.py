from flask import Blueprint
from app.controllers import transactions_controller

# Create blueprint
transactions_bp = Blueprint('transactions', __name__)

# Transaction CRUD operations
transactions_bp.route('/', methods=['POST'])(transactions_controller.create_transaction)
transactions_bp.route('/', methods=['GET'])(transactions_controller.get_all_transactions)
transactions_bp.route('/<transaction_id>', methods=['GET'])(transactions_controller.get_transaction)
transactions_bp.route('/<transaction_id>', methods=['PUT'])(transactions_controller.update_transaction)
transactions_bp.route('/<transaction_id>', methods=['DELETE'])(transactions_controller.delete_transaction)

# Bulk operations
transactions_bp.route('/all', methods=['DELETE'])(transactions_controller.delete_all_transactions)

# Analytics endpoints
transactions_bp.route('/totals', methods=['GET'])(transactions_controller.get_totals)
transactions_bp.route('/summary/monthly', methods=['GET'])(transactions_controller.get_monthly_summary)