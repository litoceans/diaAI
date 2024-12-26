from fastapi.openapi.utils import get_openapi
from app.core.config import get_settings

settings = get_settings()

def custom_openapi():
    """Customize OpenAPI documentation"""
    
    def custom_schema():
        if not app.openapi_schema:
            openapi_schema = get_openapi(
                title=settings.PROJECT_NAME,
                version="1.0.0",
                description="""
                DiaAI API Documentation
                
                This API provides endpoints for:
                - User authentication and management
                - Project creation and management
                - AI-powered diagram generation
                - Admin operations
                
                ## Authentication
                All endpoints except `/auth/login` and `/auth/signup` require authentication.
                Use the Bearer token received from login/signup in the Authorization header:
                ```
                Authorization: Bearer <your_token>
                ```
                
                ## Rate Limiting
                The API implements rate limiting based on:
                - 60 requests per minute for regular endpoints
                - Special limits for diagram generation based on user plan
                
                ## Plans and Credits
                - Free: 10 credits/month
                - Pro: 100 credits/month
                - Enterprise: 1000 credits/month
                
                ## Error Responses
                The API uses standard HTTP status codes and returns error details in the response body:
                ```json
                {
                    "detail": "Error message"
                }
                ```
                """,
                routes=app.routes,
            )
            
            # Customize tags
            openapi_schema["tags"] = [
                {
                    "name": "Authentication",
                    "description": "Endpoints for user authentication and token management"
                },
                {
                    "name": "Users",
                    "description": "User profile and credit management"
                },
                {
                    "name": "Projects",
                    "description": "Project creation and management"
                },
                {
                    "name": "Diagrams",
                    "description": "AI-powered diagram generation"
                },
                {
                    "name": "Admin",
                    "description": "Administrative operations"
                }
            ]
            
            # Add security schemes
            openapi_schema["components"]["securitySchemes"] = {
                "Bearer": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT"
                }
            }
            
            # Add global security
            openapi_schema["security"] = [{"Bearer": []}]
            
            app.openapi_schema = openapi_schema
        
        return app.openapi_schema
    
    return custom_schema
