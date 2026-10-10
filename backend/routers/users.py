from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import select
from backend.database import get_db
from ..import models, schemas, utils, oauth2
from typing import List


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/", response_model=schemas.UsersCreateOutput)
def created_users(user: schemas.UsersCreate, db: Session = Depends(get_db)):


    hashed_password = utils.hash(user.password)

    user_data = user.model_dump()

    user_data['password'] = hashed_password

    new_user = models.Users(**user_data)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.patch("/me", response_model=schemas.UsersUpdateOutput)
def updated_user(
    user: schemas.UsersUpdate,
    db: Session = Depends(get_db),
    current_user: models.Users = Depends(oauth2.get_current_user)
):
    for key, value in user.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)

    return current_user
