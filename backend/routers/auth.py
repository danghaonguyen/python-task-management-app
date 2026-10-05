from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import select
from ..database import get_db
from ..import models, schemas, utils, oauth2


router = APIRouter()


@router.post("/login")
def login_user(user: schemas.Login, db: Session = Depends(get_db)):

    login = select(models.Users).where(models.Users.email == user.email)

    login_us = db.scalars(login).first()

    if not login_us:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                             detail="Invalid Credentials")

    verify_login = utils.verify(user.password, login_us.password)

    if not verify_login:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="Invalid Credentials")

    access_token = oauth2.create_access_token({"user_id": login_us.id})

    return {"access_token": access_token,
            "token_type": "bearer"}

