from typing import Any, Optional, Dict
from datetime import datetime, timedelta
import json
from app.core.logger import logger
import threading

class MemoryCache:
    def __init__(self):
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.prefix = "diagai:"
        self._lock = threading.Lock()
        self._cleanup_interval = 300  # 5 minutes
        self._last_cleanup = datetime.now()
    
    def _get_key(self, key: str) -> str:
        """Get prefixed key"""
        return f"{self.prefix}{key}"
    
    def _cleanup_expired(self) -> None:
        """Clean up expired cache entries"""
        now = datetime.now()
        if (now - self._last_cleanup).total_seconds() < self._cleanup_interval:
            return
            
        with self._lock:
            expired_keys = []
            for key, value in self.cache.items():
                if value.get("expires_at") and value["expires_at"] < now:
                    expired_keys.append(key)
            
            for key in expired_keys:
                del self.cache[key]
            
            self._last_cleanup = now
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            self._cleanup_expired()
            key = self._get_key(key)
            with self._lock:
                if key in self.cache:
                    value = self.cache[key]
                    if value.get("expires_at") and value["expires_at"] < datetime.now():
                        del self.cache[key]
                        return None
                    return value["data"]
            return None
        except Exception as e:
            logger.error(f"Cache get failed for key {key}: {str(e)}")
            return None
    
    async def set(
        self,
        key: str,
        value: Any,
        expire: Optional[int] = None
    ) -> bool:
        """Set value in cache with optional expiration in seconds"""
        try:
            key = self._get_key(key)
            expires_at = None
            if expire:
                expires_at = datetime.now() + timedelta(seconds=expire)
            
            with self._lock:
                self.cache[key] = {
                    "data": value,
                    "expires_at": expires_at
                }
            return True
        except Exception as e:
            logger.error(f"Cache set failed for key {key}: {str(e)}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete value from cache"""
        try:
            key = self._get_key(key)
            with self._lock:
                if key in self.cache:
                    del self.cache[key]
            return True
        except Exception as e:
            logger.error(f"Cache delete failed for key {key}: {str(e)}")
            return False
    
    async def clear_prefix(self, prefix: str) -> bool:
        """Clear all keys with prefix"""
        try:
            prefix = self._get_key(prefix)
            with self._lock:
                keys_to_delete = [k for k in self.cache.keys() if k.startswith(prefix)]
                for key in keys_to_delete:
                    del self.cache[key]
            return True
        except Exception as e:
            logger.error(f"Cache clear prefix failed for {prefix}: {str(e)}")
            return False
    
    async def init(self):
        """Initialize cache - kept for compatibility"""
        pass
    
    async def close(self):
        """Close cache - kept for compatibility"""
        with self._lock:
            self.cache.clear()

# Create cache instance
cache = MemoryCache()
