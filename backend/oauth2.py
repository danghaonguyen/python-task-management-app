from jose import JWTError, jwt
from .config import settings
from fastapi import Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy.sql import select
from .database import get_db
from .import models
from datetime import datetime, timedelta

# Cách 1: OAuth2PasswordBearer
# Dùng để lấy Bearer Token từ request và khai báo tokenUrl
# cho OAuth2 Password Flow trên Swagger.
# Token được trả về trực tiếp dưới dạng chuỗi (str).

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


# Cách 2: HTTPBearer
# Dùng để lấy thông tin Bearer Token từ HTTP Authorization Header.
# Trả về đối tượng HTTPAuthorizationCredentials.
# Lấy chuỗi JWT bằng thuộc tính .credentials.
# auto_error=False cho phép tự xử lý trường hợp thiếu thông tin xác thực.

oauth2_scheme = HTTPBearer(auto_error=False)


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
    
# Cách 1: Xác thực người dùng - OAuth2PasswordBearer
# def get_current_user(token: str = Depends(oauth2_scheme),
#                      db: Session = Depends(get_db)):

#     credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
#                                            detail="Could not validate credentials",
#                                            headers={"WWW-Authenticate" : "Bearer"})

#     user_id = verify_access_token(token, credentials_exception)

#     query = select(models.Users).where(models.Users.id == user_id)

#     current_user = db.scalars(query).first()

#     if current_user is None:
#         raise credentials_exception

#     return current_user

# Cách 2: Xác thực người dùng - HTTPBearer => Nếu muốn dùng SwaggerUI để dùng Authorize
def get_current_user(
    auth_info: HTTPAuthorizationCredentials | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    if auth_info is None:
        raise credentials_exception

    token = auth_info.credentials

    user_id = verify_access_token(token, credentials_exception)

    query = select(models.Users).where(models.Users.id == user_id)
    user = db.scalars(query).first()

    if user is None:
        raise credentials_exception

    return user


# Xác thực vai trò admin - user
def get_current_admin(
    current_user: models.Users = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource"
        )

    return current_user
