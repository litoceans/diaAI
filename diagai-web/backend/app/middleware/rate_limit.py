from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import get_settings
import time
from collections import defaultdict
import asyncio

settings = get_settings()

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.request_counts = defaultdict(list)
        self.lock = asyncio.Lock()
    
    def _cleanup_old_requests(self, key: str):
        """Remove requests older than 1 minute"""
        current_time = time.time()
        self.request_counts[key] = [
            req_time for req_time in self.request_counts[key]
            if current_time - req_time < 60
        ]
    
    async def dispatch(self, request: Request, call_next):
        if not settings.RATE_LIMIT_ENABLED:
            return await call_next(request)
            
        # Skip rate limiting for static files and docs
        if request.url.path.startswith(("/storage/", "/docs", "/redoc", "/openapi.json")):
            return await call_next(request)
        
        # Get client IP
        client_ip = request.client.host
        
        # Get user ID from token if available
        user_id = None
        try:
            token = request.headers.get("Authorization")
            if token and token.startswith("Bearer "):
                # You might want to decode the token here to get user_id
                pass
        except:
            pass
        
        # Use user_id if available, otherwise use IP
        rate_limit_key = user_id or client_ip
        
        async with self.lock:
            # Clean up old requests
            self._cleanup_old_requests(rate_limit_key)
            
            # Check rate limit
            current_time = time.time()
            request_count = len(self.request_counts[rate_limit_key])
            
            if request_count >= settings.RATE_LIMIT_PER_MINUTE:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Please try again in a minute."
                )
            
            # Add current request
            self.request_counts[rate_limit_key].append(current_time)
        
        # Process the request
        response = await call_next(request)
        
        # Add rate limit headers
        remaining = settings.RATE_LIMIT_PER_MINUTE - len(self.request_counts[rate_limit_key])
        response.headers["X-RateLimit-Limit"] = str(settings.RATE_LIMIT_PER_MINUTE)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(current_time + 60))
        
        return response
