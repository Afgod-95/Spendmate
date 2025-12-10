from flask import jsonify, request
from werkzeug.utils import secure_filename
from app.supabase.supabase_client import supabase
import uuid as uuid_lib
from app.helpers.image_helper import optimize_image

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# Storage bucket name
PROFILE_IMAGES_BUCKET = 'profile-images'


def allowed_file(filename: str) -> bool:
    """Check if file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------- Upload Profile Image ----------------
def upload_profile_image() -> tuple:
    """
    Uploads a profile image to Supabase Storage and returns the public URL.
    """
    uid = request.headers.get("X-User-UID")
    
    if not uid:
        return jsonify({"error": "User ID required"}), 401
    
    # Check if file is in request
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    if not file.filename or file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Allowed: png, jpg, jpeg, gif, webp"}), 400
    
    try:
        # Read file content
        file_content = file.read()
        
        # Generate unique filename
        file_ext = file.filename.rsplit('.', 1)[1].lower()
        
        #optimized image before upload 
        optimized_image = optimize_image(file_content, max_size=(800,800), quality=85)
        unique_filename = f"{uid}/{uuid_lib.uuid4()}.{file_ext}"     
        
        # Upload to Supabase Storage
        response = supabase.storage.from_(PROFILE_IMAGES_BUCKET).upload(
            path=unique_filename,
            file=optimized_image,
            file_options={"content-type": f"image/{file_ext}"}
        )
        
        # Get public URL
        public_url = supabase.storage.from_(PROFILE_IMAGES_BUCKET).get_public_url(unique_filename)
        
        # Update profile with new image URL
        supabase.table("profiles").update({
            "profile_image": public_url
        }).eq("id", uid).execute()
        
        return jsonify({
            "message": "Profile image uploaded successfully",
            "url": public_url,
            "response": response
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to upload image", "details": str(e)}), 500







# ---------------- Delete Profile Image ----------------
def delete_profile_image() -> tuple:
    """
    Deletes the current profile image from Supabase Storage.
    """
    uid = request.headers.get("X-User-UID")
    
    if not uid:
        return jsonify({"error": "User ID required"}), 401
    
    try:
        # Get current profile image URL
        profile = supabase.table("profiles").select("profile_image").eq("id", uid).single().execute()
        
        if not profile.data or not isinstance(profile.data, dict) or not profile.data.get("profile_image"):
            return jsonify({"error": "No profile image to delete"}), 404
        
        # Extract file path from URL
        image_url = profile.data.get("profile_image")
        
        # Ensure image_url is a string before splitting
        if not isinstance(image_url, str) or not image_url:
            return jsonify({"error": "Invalid profile image URL"}), 400
        
        # Parse the path from the URL (after /storage/v1/object/public/profile-images/)
        file_path = image_url.split(f"{PROFILE_IMAGES_BUCKET}/")[-1]
        
        # Delete from storage
        supabase.storage.from_(PROFILE_IMAGES_BUCKET).remove([file_path])
        
        # Update profile to remove image URL
        supabase.table("profiles").update({
            "profile_image": ""
        }).eq("id", uid).execute()
        
        return jsonify({"message": "Profile image deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to delete image", "details": str(e)}), 500