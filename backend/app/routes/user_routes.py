from flask import Blueprint
from app.controllers.user_controller import register_user, login_user, update_email, update_password, refresh_access_token
from app.controllers.profile_controller import get_profile, update_profile
from app.controllers.image_controller import upload_profile_image, delete_profile_image
from app.middlewares.auth_middleware import require_auth

user_bp = Blueprint('user_bp', __name__)

# Auth routes
user_bp.route('/register', methods=['POST'])(register_user)
user_bp.route('/login', methods=['POST'])(login_user)

# Profile routes (protected)
user_bp.route('/profile', methods=['GET'])(require_auth(get_profile))
user_bp.route('/profile', methods=['PUT'])(require_auth(update_profile))

# Image upload routes (protected)
user_bp.route('/profile/image', methods=['POST'])(require_auth(upload_profile_image))
user_bp.route('/profile/image', methods=['DELETE'])(require_auth(delete_profile_image))

# Account update routes (protected)
user_bp.route('/password', methods=['PUT'])(require_auth(update_password))
user_bp.route('/email', methods=['PUT'])(require_auth(update_email))


#refresh token 
user_bp.route('/refresh-token', methods=['POST'])(refresh_access_token)

