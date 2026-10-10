from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import select

from ..database import get_db
from .. import models, oauth2

router = APIRouter(prefix="/admin", tags=["Admin"])


def format_user(user):

    return {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "created_at": user.created_at,
            }


def format_task(task):

    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "due_at": task.due_at,
        "created_at": task.created_at,
        "user_id": task.user_id,
        "completed": task.completed
    }


@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_admin: models.Users = Depends(oauth2.get_current_admin),
):
    query = select(models.Users)
    users = db.scalars(query).all()


    return [format_user(user) for user in users]


@router.get("/users/{id}")
def get_user_id(
    id: int,
    db: Session = Depends(get_db),
    current_admin: models.Users = Depends(oauth2.get_current_admin),
):

    query = select(models.Users).where(models.Users.id == id)

    users = db.scalars(query).first()

    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User id was not found"
        )


    return format_user(users)

@router.delete("/users/{id}")
def delete_user_id(id: int, db: Session = Depends(get_db), current_admin: models.Users = Depends(oauth2.get_current_admin)):

    query = select(models.Users).where(models.Users.id == id)

    users = db.scalars(query).first()

    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail="User id was not found")

    db.delete(users)
    db.commit()

    return {"message": "Xóa thành công"}


@router.get("/tasks/all")
def get_all_tasks(db: Session = Depends(get_db), current_admin: models.Users = Depends(oauth2.get_current_admin)):

    query = select(models.Tasks)
    tasks = db.scalars(query).all()


    return [format_task(task) for task in tasks]