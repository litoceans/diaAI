from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from app.core.config import get_settings

settings = get_settings()

class Database:
    client: AsyncIOMotorClient = None
    
    async def connect_to_database(self):
        """Create database connection."""
        try:
            if self.client is None:
                self.client = AsyncIOMotorClient(
                    settings.MONGODB_URL,
                    server_api=ServerApi('1'),
                    serverSelectionTimeoutMS=5000
                )
                await self.client.admin.command('ping')
                print("Successfully connected to MongoDB")
                
        except Exception as e:
            print(f"Could not connect to MongoDB: {e}")
            raise e

    async def close_database_connection(self):
        """Close database connection."""
        if self.client is not None:
            self.client.close()
            self.client = None
            print("MongoDB connection closed")

    def get_db(self):
        """Get database instance."""
        if self.client is None:
            raise Exception("Database client not initialized")
        return self.client.get_database('diagai_db')

# Create a database instance
db = Database()
