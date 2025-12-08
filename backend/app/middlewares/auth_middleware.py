from flask import request, jsonify, g
from functools import wraps
from app.supabase.supabase_client import supabase

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Invalid Authorization header format"}), 401

        token = parts[1]

        try:
            # Call Supabase
            res = supabase.auth.get_user(token)

            # Extract the user from the response
            user = getattr(res, "user", None)

            if not user:
                return jsonify({"error": "Invalid or expired token"}), 401

            # Store only what you need (user.id)
            g.user_id = user.id
            g.user = user  # optional if you need full user details

        except Exception as e:
            return jsonify({"error": "Unauthorized", "details": str(e)}), 401

        return f(*args, **kwargs)

    return decorated
