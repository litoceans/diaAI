# DiaAI Backend

Backend service for the DiaAI application, built with FastAPI and MongoDB.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
Create a `.env` file with the following variables:
```
MONGODB_URL=your_mongodb_url
SECRET_KEY=your_secret_key
FIREBASE_CREDENTIALS=path_to_firebase_credentials.json
```

3. Run the server:
```bash
uvicorn main:app --reload
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py         # Dependencies and utilities
│   │   └── v1/            # API endpoints
│   ├── core/
│   │   └── security.py    # Security utilities
│   └── models/
│       ├── user.py        # User models
│       ├── project.py     # Project models
│       └── diagram.py     # Diagram models
├── main.py                # FastAPI application
└── requirements.txt       # Python dependencies
```

## Features

- JWT Authentication
- Firebase Integration
- MongoDB Database
- Legacy Encryption
- CORS Support
- API Rate Limiting
- Error Handling
- Admin Management
