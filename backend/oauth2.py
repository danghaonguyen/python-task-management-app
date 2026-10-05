from jose import JWTError, jwt
from .config import settings
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy.sql import select
from .database import get_db
from .import models
from datetime import datetime, timedelta

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


SECRET_KEY=settings.secret_key
ALGORITHM=settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES=settings.access_token_expire_minutes



def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return token


def verify_access_token(token: str, credentials_exception):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            raise credentials_exception

        return user_id

    except JWTError:
        raise credentials_exception
    

def get_current_user(token: str = Depends(oauth2_scheme),
                     db: Session = Depends(get_db)):

    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                           detail="Could not validate credentials",
                                           headers={"WWW-Authenticate" : "Bearer"})

    user_id = verify_access_token(token, credentials_exception)

    query = select(models.Users).where(models.Users.id == user_id)

    current_user = db.scalars(query).first()

    if current_user is None:
        raise credentials_exception

    return current_user