import os
import shutil
import tarfile
from datetime import datetime
import boto3
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings
from app.core.logger import logger

settings = get_settings()

class BackupService:
    def __init__(self):
        self.backup_dir = os.path.join("backups")
        self.storage_dir = settings.STORAGE_PATH
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
            aws_secret_access_key=os.getenv("AWS_SECRET_KEY")
        ) if os.getenv("AWS_ACCESS_KEY") else None
        self.s3_bucket = os.getenv("AWS_BACKUP_BUCKET")
        
        # Create backup directory if it doesn't exist
        os.makedirs(self.backup_dir, exist_ok=True)
    
    async def create_backup(self):
        """Create a full backup of the database and files"""
        try:
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            backup_path = os.path.join(self.backup_dir, f"backup_{timestamp}")
            os.makedirs(backup_path, exist_ok=True)
            
            # Backup database
            await self._backup_database(backup_path)
            
            # Backup storage files
            self._backup_storage(backup_path)
            
            # Create archive
            archive_path = f"{backup_path}.tar.gz"
            self._create_archive(backup_path, archive_path)
            
            # Upload to S3 if configured
            if self.s3_client and self.s3_bucket:
                self._upload_to_s3(archive_path)
            
            # Cleanup
            shutil.rmtree(backup_path)
            
            logger.info(f"Backup created successfully: {archive_path}")
            return archive_path
            
        except Exception as e:
            logger.error(f"Backup failed: {str(e)}", exc_info=True)
            raise
    
    async def _backup_database(self, backup_path: str):
        """Backup MongoDB database"""
        try:
            client = AsyncIOMotorClient(settings.MONGODB_URL)
            db = client.diagai_db
            
            # Get all collections
            collections = await db.list_collection_names()
            
            # Backup each collection
            for collection in collections:
                docs = await db[collection].find().to_list(None)
                if docs:
                    file_path = os.path.join(backup_path, f"{collection}.json")
                    with open(file_path, 'w') as f:
                        import json
                        json.dump(docs, f, default=str)
            
            client.close()
            logger.info("Database backup completed")
            
        except Exception as e:
            logger.error(f"Database backup failed: {str(e)}", exc_info=True)
            raise
    
    def _backup_storage(self, backup_path: str):
        """Backup storage files"""
        try:
            if os.path.exists(self.storage_dir):
                storage_backup_path = os.path.join(backup_path, "storage")
                shutil.copytree(self.storage_dir, storage_backup_path)
                logger.info("Storage backup completed")
                
        except Exception as e:
            logger.error(f"Storage backup failed: {str(e)}", exc_info=True)
            raise
    
    def _create_archive(self, source_path: str, archive_path: str):
        """Create tar.gz archive of backup"""
        try:
            with tarfile.open(archive_path, "w:gz") as tar:
                tar.add(source_path, arcname=os.path.basename(source_path))
            logger.info(f"Archive created: {archive_path}")
            
        except Exception as e:
            logger.error(f"Archive creation failed: {str(e)}", exc_info=True)
            raise
    
    def _upload_to_s3(self, file_path: str):
        """Upload backup to S3"""
        try:
            if self.s3_client and self.s3_bucket:
                file_name = os.path.basename(file_path)
                self.s3_client.upload_file(
                    file_path,
                    self.s3_bucket,
                    f"backups/{file_name}"
                )
                logger.info(f"Backup uploaded to S3: {file_name}")
                
        except Exception as e:
            logger.error(f"S3 upload failed: {str(e)}", exc_info=True)
            raise
    
    async def cleanup_old_backups(self, keep_days: int = 7):
        """Remove old backups"""
        try:
            current_time = datetime.utcnow()
            for file_name in os.listdir(self.backup_dir):
                file_path = os.path.join(self.backup_dir, file_name)
                if os.path.isfile(file_path):
                    file_time = datetime.fromtimestamp(os.path.getctime(file_path))
                    if (current_time - file_time).days > keep_days:
                        os.remove(file_path)
                        logger.info(f"Removed old backup: {file_name}")
                        
        except Exception as e:
            logger.error(f"Backup cleanup failed: {str(e)}", exc_info=True)
            raise
