from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import get_settings
import logging
import json
import time
from typing import Callable
import sys

settings = get_settings()

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(settings.LOG_FILE),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        # Start timer
        start_time = time.time()
        
        # Get request details
        request_details = {
            "method": request.method,
            "url": str(request.url),
            "client_ip": request.client.host if request.client else None,
            "headers": dict(request.headers),
        }
        
        response = None
        try:
            # Process request
            response = await call_next(request)
            
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Log successful request
            log_data = {
                **request_details,
                "status_code": response.status_code,
                "processing_time": f"{process_time:.4f}s"
            }
            
            if settings.LOG_FORMAT == "json":
                logger.info(json.dumps(log_data))
            else:
                logger.info(f"Request processed: {log_data}")
                
            return response
            
        except Exception as e:
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Log error
            error_data = {
                **request_details,
                "error": str(e),
                "processing_time": f"{process_time:.4f}s"
            }
            
            if settings.LOG_FORMAT == "json":
                logger.error(json.dumps(error_data))
            else:
                logger.error(f"Request failed: {error_data}")
            
            raise  # Re-raise the exception
