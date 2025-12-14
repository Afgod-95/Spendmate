# app/controllers/user_controller.py
from flask import request, jsonify
from app.supabase.supabase_client import supabase 
import re
from typing import Optional



# Email validation regex
EMAIL_REGEX = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'


# ---------------- Register User ----------------
def register_user() -> tuple:
    """
    Registers a new user with Supabase Auth and stores extra metadata in profiles table.
    """
    data = request.get_json()
    name: str = data.get("name", "").strip()
    email: str = data.get("email", "").strip()
    password: str = data.get("password", "").strip()

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400
    if not re.match(EMAIL_REGEX, email):
        return jsonify({"error": "Please enter a valid email"}), 400

    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": {"name": name}}
        })

        if not response.user:
            return jsonify({"error": response.session or "Registration failed"}), 400

        if response.user.email:
            return jsonify({"error": "User email already exist"}), 500
        
        # JSON-serializable user object
        user_data = {
            "id": response.user.id,
            "email": response.user.email,
            "created_at": str(response.user.created_at),
            "user_metadata": response.user.user_metadata
        }

        # Insert into profiles table
        uuid = response.user.id
        supabase.table("profiles").insert({
            "id": uuid,
            "name": name,
            "profile_image": ''
        }).execute()

        return jsonify({"message": "User registered successfully", "user": user_data}), 201

    except Exception as profile_error:
        return jsonify({"error": "Failed to create profile", "details": str(profile_error)}), 500





# ---------------- Login User ----------------
def login_user() -> tuple:
    """
    Logs in a user using email/password and checks email verification.
    """
    data = request.get_json()
    email: str = data.get("email", "").strip()
    password: str = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and Password are required"}), 400
    if not re.match(EMAIL_REGEX, email):
        return jsonify({"error": "Please enter a valid email"}), 400

    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if not response.user:
            return jsonify({"error": "Invalid email or password"}), 401

        if not response.user.confirmed_at:
            return jsonify({"error": "Please verify your email"}), 403

        # Convert user/session to dict
        user_info = {
            "id": response.user.id,
            "email": response.user.email,
            "created_at": str(response.user.created_at),
            "user_metadata": response.user.user_metadata
        }

        session_info = {
            "access_token": response.session.access_token if response.session else None,
            "refresh_token": response.session.refresh_token if response.session else None
        }

        return jsonify({
            "message": "User logged in successfully",
            "user": user_info,
            "session": session_info
        }), 200

    except Exception as e:
        return jsonify({"error": "Login failed", "details": str(e)}), 500





# ---------------- Update Password ----------------
def update_password() -> tuple:
    data = request.get_json()
    new_password: str = data.get("password", "").strip()
    access_token: Optional[str] = request.headers.get("Authorization")  # Bearer <token>

    if not new_password:
        return jsonify({"error": "Password is required"}), 400
    if not access_token:
        return jsonify({"error": "Access token required"}), 401

    try:
        # Extract token from "Bearer <token>" format
        token = access_token.replace("Bearer ", "") if access_token else ""
        supabase.auth.set_session(token, '')
        supabase.auth.update_user({"password": new_password})
        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to update password", "details": str(e)}), 500




# ---------------- Email Update ----------------
def update_email() -> tuple:
    data = request.get_json()
    new_email: Optional[str] = data.get("email", "").strip()
    access_token: Optional[str] = request.headers.get("Authorization")

    if not new_email:
        return jsonify({"error": "Email is required"}), 400
    if not access_token:
        return jsonify({"error": "Access token required"}), 401

    try: 
        supabase.auth.set_session(access_token, '')
        supabase.auth.update_user({"email": new_email})
        return jsonify({"message": "Email updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to update email", "details": str(e)}), 500





# ---------------- Refresh Token ----------------
def refresh_access_token() -> tuple:
    """
    Uses a refresh token to get a new access token.
    """
    data = request.get_json()
    refresh_token: str = data.get("refresh_token", "").strip()

    if not refresh_token:
        return jsonify({"error": "Refresh token is required"}), 400

    try:
        # Exchange refresh token for a new session
        session_response = supabase.auth.refresh_session(refresh_token)

        if not session_response.session:
            return jsonify({"error": "Invalid refresh token"}), 401

        new_session = {
            "access_token": session_response.session.access_token,
            "refresh_token": session_response.session.refresh_token,
            "expires_at": str(session_response.session.expires_at)
        }

        return jsonify({
            "message": "Access token refreshed successfully",
            "session": new_session
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to refresh token", "details": str(e)}), 500

