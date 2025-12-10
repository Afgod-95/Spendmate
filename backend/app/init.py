from flask import Flask
from app.routes.user_routes import user_bp
from app.routes.transaction_route import transactions_bp
from app.routes.category_route import category_bp


def create_app():
    app = Flask(__name__)
    app.register_blueprint(user_bp, url_prefix = '/api/users')
    
    app.register_blueprint(transactions_bp, url_prefix = '/api/transactions')
    app.register_blueprint(category_bp, url_prefix = '/api/categories')
    
    return app