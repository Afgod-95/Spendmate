from PIL import Image
from io import BytesIO

def optimize_image(file_content, max_size=(800, 800), quality=85):
    """Optimize image before uploading."""
    img = Image.open(BytesIO(file_content))
    
    # Convert RGBA to RGB if necessary
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background
    
    # Resize if too large
    img.thumbnail(max_size, Image.Resampling.LANCZOS)
    
    # Save optimized
    output = BytesIO()
    img.save(output, format='JPEG', quality=quality, optimize=True)
    return output.getvalue()