from prometheus_client import Counter, Histogram, Gauge, CollectorRegistry, generate_latest
import time
from typing import Optional
from functools import wraps
from app.core.logger import logger

# Create registry
REGISTRY = CollectorRegistry(auto_describe=True)

# Request metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total number of HTTP requests',
    ['method', 'endpoint', 'status'],
    registry=REGISTRY
)

REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency in seconds',
    ['method', 'endpoint'],
    registry=REGISTRY
)

# Database metrics
DB_QUERY_LATENCY = Histogram(
    'db_query_duration_seconds',
    'Database query latency in seconds',
    ['operation', 'collection'],
    registry=REGISTRY
)

DB_CONNECTION_POOL = Gauge(
    'db_connection_pool_size',
    'Database connection pool size',
    registry=REGISTRY
)

# Cache metrics
CACHE_HITS = Counter(
    'cache_hits_total',
    'Total number of cache hits',
    ['cache_type'],
    registry=REGISTRY
)

CACHE_MISSES = Counter(
    'cache_misses_total',
    'Total number of cache misses',
    ['cache_type'],
    registry=REGISTRY
)

# Business metrics
DIAGRAM_GENERATION_COUNT = Counter(
    'diagram_generation_total',
    'Total number of diagrams generated',
    ['type', 'status'],
    registry=REGISTRY
)

DIAGRAM_GENERATION_LATENCY = Histogram(
    'diagram_generation_duration_seconds',
    'Diagram generation latency in seconds',
    ['type'],
    registry=REGISTRY
)

USER_CREDITS = Gauge(
    'user_credits',
    'Current user credits',
    ['user_id'],
    registry=REGISTRY
)

class MetricsMiddleware:
    async def __call__(self, request, call_next):
        start_time = time.time()
        
        try:
            response = await call_next(request)
            
            # Record request metrics
            REQUEST_COUNT.labels(
                method=request.method,
                endpoint=request.url.path,
                status=response.status_code
            ).inc()
            
            REQUEST_LATENCY.labels(
                method=request.method,
                endpoint=request.url.path
            ).observe(time.time() - start_time)
            
            return response
            
        except Exception as e:
            # Record failed request
            REQUEST_COUNT.labels(
                method=request.method,
                endpoint=request.url.path,
                status=500
            ).inc()
            raise

def track_db_query(operation: str, collection: str):
    """Decorator to track database query metrics"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                DB_QUERY_LATENCY.labels(
                    operation=operation,
                    collection=collection
                ).observe(time.time() - start_time)
                return result
            except Exception as e:
                logger.error(f"Database operation failed: {str(e)}", exc_info=True)
                raise
        return wrapper
    return decorator

def track_cache(cache_type: str):
    """Decorator to track cache metrics"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                result = await func(*args, **kwargs)
                if result is not None:
                    CACHE_HITS.labels(cache_type=cache_type).inc()
                else:
                    CACHE_MISSES.labels(cache_type=cache_type).inc()
                return result
            except Exception as e:
                logger.error(f"Cache operation failed: {str(e)}", exc_info=True)
                raise
        return wrapper
    return decorator

def track_diagram_generation(diagram_type: str):
    """Decorator to track diagram generation metrics"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                DIAGRAM_GENERATION_COUNT.labels(
                    type=diagram_type,
                    status="success"
                ).inc()
                DIAGRAM_GENERATION_LATENCY.labels(
                    type=diagram_type
                ).observe(time.time() - start_time)
                return result
            except Exception as e:
                DIAGRAM_GENERATION_COUNT.labels(
                    type=diagram_type,
                    status="failure"
                ).inc()
                raise
        return wrapper
    return decorator

def update_user_credits(user_id: str, credits: float):
    """Update user credits metric"""
    USER_CREDITS.labels(user_id=user_id).set(credits)

def get_metrics():
    """Get current metrics in Prometheus format"""
    try:
        return generate_latest(REGISTRY)
    except Exception as e:
        logger.error(f"Failed to generate metrics: {str(e)}", exc_info=True)
        return b""
