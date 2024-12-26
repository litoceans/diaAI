from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from app.core.config import get_settings
import firebase_admin
from firebase_admin import auth, credentials
import os

settings = get_settings()

# Initialize Firebase Admin
cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
firebase_admin.initialize_app(cred)

# JWT settings
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def verify_google_token(token: str) -> dict:
    try:
        # Verify the ID token while checking if the token is revoked by
        # passing check_revoked=True
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        
        # Token is valid and not revoked
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token["email"],
            "name": decoded_token.get("name"),
            "picture": decoded_token.get("picture")
        }
    except auth.RevokedIdTokenError:
        raise ValueError("Token has been revoked. Please reauthenticate.")
    except auth.InvalidIdTokenError:
        raise ValueError("Invalid token. Please reauthenticate.")
    except Exception as e:
        raise ValueError(f"Token verification failed: {str(e)}")
