from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.services.backup import BackupService
from app.core.logger import logger
from datetime import datetime

class Scheduler:
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.backup_service = BackupService()
    
    async def backup_job(self):
        """Daily backup job"""
        try:
            logger.info("Starting daily backup")
            await self.backup_service.create_backup()
            await self.backup_service.cleanup_old_backups(keep_days=7)
            logger.info("Daily backup completed")
        except Exception as e:
            logger.error(f"Daily backup failed: {str(e)}", exc_info=True)
    
    def start(self):
        """Start the scheduler"""
        try:
            # Add backup job (runs daily at 2 AM)
            self.scheduler.add_job(
                self.backup_job,
                CronTrigger(hour=2, minute=0)
            )
            
            # Start the scheduler
            self.scheduler.start()
            logger.info("Scheduler started successfully")
            
        except Exception as e:
            logger.error(f"Failed to start scheduler: {str(e)}", exc_info=True)
            raise
    
    def shutdown(self):
        """Shutdown the scheduler"""
        try:
            self.scheduler.shutdown()
            logger.info("Scheduler shutdown successfully")
            
        except Exception as e:
            logger.error(f"Failed to shutdown scheduler: {str(e)}", exc_info=True)
            raise

# Create scheduler instance
scheduler = Scheduler()
