import logging
import sys
from datetime import datetime
from pathlib import Path
from logging.handlers import RotatingFileHandler
import json
from typing import Any, Dict
import traceback

class CustomJSONFormatter(logging.Formatter):
    def __init__(self):
        super().__init__()
    
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        
        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = {
                "type": str(record.exc_info[0].__name__),
                "message": str(record.exc_info[1]),
                "traceback": traceback.format_exception(*record.exc_info)
            }
        
        # Add extra fields if present
        if hasattr(record, "extra_fields"):
            log_data.update(record.extra_fields)
        
        return json.dumps(log_data)

def setup_logging(
    log_file: str = "logs/app.log",
    level: int = logging.INFO,
    max_size: int = 10 * 1024 * 1024,  # 10MB
    backup_count: int = 5
) -> logging.Logger:
    """Setup logging configuration"""
    
    # Create logs directory if it doesn't exist
    log_path = Path(log_file).parent
    log_path.mkdir(parents=True, exist_ok=True)
    
    # Create logger
    logger = logging.getLogger("diagai")
    logger.setLevel(level)
    
    # Create formatters
    json_formatter = CustomJSONFormatter()
    console_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)
    
    # Create file handler
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=max_size,
        backupCount=backup_count
    )
    file_handler.setFormatter(json_formatter)
    logger.addHandler(file_handler)
    
    return logger

# Create logger instance
logger = setup_logging()

def log_request(request, response=None, error=None):
    """Log HTTP request and response"""
    log_data = {
        "extra_fields": {
            "request": {
                "method": request.method,
                "url": str(request.url),
                "headers": dict(request.headers),
                "client_ip": request.client.host
            }
        }
    }
    
    if response:
        log_data["extra_fields"]["response"] = {
            "status_code": response.status_code,
            "headers": dict(response.headers)
        }
    
    if error:
        log_data["extra_fields"]["error"] = str(error)
        logger.error("Request failed", extra=log_data)
    else:
        logger.info("Request processed", extra=log_data)

def log_diagram_generation(prompt: str, user_id: str, success: bool, error: str = None):
    """Log diagram generation attempt"""
    log_data = {
        "extra_fields": {
            "diagram_generation": {
                "prompt": prompt,
                "user_id": user_id,
                "success": success
            }
        }
    }
    
    if error:
        log_data["extra_fields"]["diagram_generation"]["error"] = error
        logger.error("Diagram generation failed", extra=log_data)
    else:
        logger.info("Diagram generated successfully", extra=log_data)
