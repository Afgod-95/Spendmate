from flask import jsonify, request
from app.supabase.supabase_client import supabase


# ---------------- Get User Profile ----------------
def get_profile() -> tuple:
    """
    Retrieves user profile data from the profiles table.
    """
    uid = request.headers.get("X-User-UID")

    if not uid:
        return jsonify({"error": "User ID required"}), 401

    try:
        profile = supabase.table("profiles").select("*").eq("id", uid).single().execute()
        
        if not profile.data:
            return jsonify({"error": "Profile not found"}), 404

        return jsonify({"profile": profile.data}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch profile", "details": str(e)}), 500
    


# ---------------- Update Profile ----------------
def update_profile() -> tuple:
    """
    Updates user profile (name, profile_image) in custom 'profiles' table.
    Note: For uploading images, use upload_profile_image() endpoint instead.
    """
    data = request.get_json()
    uid = request.headers.get("X-User-UID")
    name: str = data.get("name", "").strip()
    profile_image: str = data.get("profile_image", "").strip()  # URL from Supabase Storage

    if not uid:
        return jsonify({"error": "User ID required"}), 401

    # Build update dict dynamically to only update provided fields
    update_data = {}
    if name:
        update_data["name"] = name
    if profile_image:
        update_data["profile_image"] = profile_image

    if not update_data:
        return jsonify({"error": "No fields to update"}), 400

    try:
        updated = supabase.table("profiles").update(update_data).eq("id", uid).execute()

        return jsonify({"message": "Profile updated", "data": updated.data}), 200
    except Exception as e:
        return jsonify({"error": "Failed to update profile", "details": str(e)}), 500