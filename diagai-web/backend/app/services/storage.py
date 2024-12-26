import os
import aiofiles
from fastapi import UploadFile
from datetime import datetime
import uuid
from PIL import Image
import io

class StorageService:
    def __init__(self):
        self.base_path = os.getenv("STORAGE_PATH", "storage")
        self.ensure_storage_path()
    
    def ensure_storage_path(self):
        """Ensure storage directories exist"""
        os.makedirs(self.base_path, exist_ok=True)
        os.makedirs(os.path.join(self.base_path, "diagrams"), exist_ok=True)
        os.makedirs(os.path.join(self.base_path, "gifs"), exist_ok=True)
    
    def get_file_path(self, file_type: str, filename: str) -> str:
        """Generate file path based on type and filename"""
        # Create year/month based directory structure
        now = datetime.now()
        year_month = now.strftime("%Y/%m")
        
        # Create directory if it doesn't exist
        dir_path = os.path.join(self.base_path, file_type, year_month)
        os.makedirs(dir_path, exist_ok=True)
        
        return os.path.join(dir_path, filename)
    
    async def save_image(self, image_data: bytes, original_filename: str = None) -> str:
        """Save image to storage and return relative path"""
        # Generate unique filename
        ext = ".png"
        if original_filename:
            ext = os.path.splitext(original_filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        
        # Get file path
        file_path = self.get_file_path("diagrams", filename)
        
        # Save image
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(image_data)
        
        # Return relative path
        return os.path.relpath(file_path, self.base_path)
    
    async def save_gif(self, frames: list, duration: int = 500) -> str:
        """Save frames as GIF and return relative path"""
        # Convert frames to PIL images
        pil_frames = []
        for frame in frames:
            img = Image.open(io.BytesIO(frame))
            pil_frames.append(img)
        
        # Generate unique filename
        filename = f"{uuid.uuid4()}.gif"
        file_path = self.get_file_path("gifs", filename)
        
        # Save as GIF
        pil_frames[0].save(
            file_path,
            save_all=True,
            append_images=pil_frames[1:],
            duration=duration,
            loop=0
        )
        
        # Return relative path
        return os.path.relpath(file_path, self.base_path)
    
    async def delete_file(self, file_path: str) -> bool:
        """Delete file from storage"""
        try:
            full_path = os.path.join(self.base_path, file_path)
            if os.path.exists(full_path):
                os.remove(full_path)
                return True
        except Exception as e:
            print(f"Error deleting file: {e}")
        return False
    
    def get_file_url(self, file_path: str) -> str:
        """Convert storage path to URL"""
        base_url = os.getenv("STORAGE_URL", "http://localhost:8000/storage")
        return f"{base_url}/{file_path}"
