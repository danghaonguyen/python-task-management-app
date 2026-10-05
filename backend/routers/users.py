from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import select
from backend.database import get_db
from ..import models, schemas, utils
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

@router.get("/", response_model=List[schemas.UsersCreateOutput])
def display_users(db: Session = Depends(get_db)):

    disp_users = select(models.Users)

    show_user = db.scalars(disp_users).all()

    return show_user

@router.get("/{id}", response_model=schemas.UsersCreateOutput)
def display_user_id(id: int, db: Session = Depends(get_db)):

    disp_user_id = select(models.Users).where(models.Users.id == id)

    show_user_id = db.scalars(disp_user_id).first()

    if not show_user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail="User id was not found")

    return show_user_id

@router.patch("/{id}", response_model=schemas.UsersUpdateOutput)
def updated_user(id: int, user: schemas.UsersUpdate, db:Session = Depends(get_db)):

    update_user_id = select(models.Users).where(models.Users.id == id)

    update_user = db.scalars(update_user_id).first()

    if not update_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                             detail="User id was not found")

    for key, value in user.model_dump(exclude_unset=True).items():
        setattr(update_user, key, value)

    db.commit()
    db.refresh(update_user)

    return update_user


@router.delete("/{id}")
def deleted_user(id: int, db: Session = Depends(get_db)):


    delete_user_id = select(models.Users).where(models.Users.id == id)

    delete_user = db.scalars(delete_user_id).first()

    if not delete_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                             detail="User id not found")

    db.delete(delete_user)
    db.commit()

    return {"message": "Xóa thành công"}