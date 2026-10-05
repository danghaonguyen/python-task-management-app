from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql import select
from ..database import get_db
from ..import models, schemas, oauth2
from ..oauth2 import get_current_user
from datetime import datetime, timedelta, date, time
from ..schemas import VN_TZ
from typing import List

router = APIRouter(
    prefix='/tasks',
    tags=["Tasks"]
)


@router.post("/", response_model=schemas.TasksCreateOutput)
def create_tasks(task: schemas.TasksCreate , db: Session = Depends(get_db), 
                 current_user: models.Users = Depends(get_current_user)):

    new_task = models.Tasks(**task.model_dump(), user_id = current_user.id)

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@router.get("/", response_model=List[schemas.TasksCreateOutput])
def display_tasks(db: Session = Depends(get_db), 
                  current_user: models.Users = Depends(get_current_user),
                  limit: int = Query(10, ge=1), skip: int = Query(0, ge=0), 
                  search: str | None = None, date: date | None = None):


    query = select(models.Tasks).where(models.Tasks.user_id == current_user.id)

    if date:

        begin_day = datetime.combine(date, time.min, tzinfo=VN_TZ)
        begin_next_day = begin_day + timedelta(days=1)

        query = query.where(models.Tasks.due_at >= begin_day, 
                            models.Tasks.due_at <  begin_next_day)

    if search:

        query = query.where(models.Tasks.title.ilike(f"%{search}%"))


    query = query.order_by(models.Tasks.due_at.asc())

    query = query.offset(skip).limit(limit)

    show_tasks = db.scalars(query).all()

    return show_tasks


@router.get("/today", response_model=List[schemas.TasksCreateOutput])
def get_tasks_today(db: Session = Depends(get_db), 
                    current_user: models.Users = Depends(get_current_user)):

    now = datetime.now(VN_TZ)

    begin_today = now.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )

    begin_tomorrow = begin_today + timedelta(days=1)

    query = select(models.Tasks).where(models.Tasks.user_id == current_user.id, 
                                       models.Tasks.due_at >= begin_today,
                                       models.Tasks.due_at < begin_tomorrow
                                       )
    query = query.order_by(models.Tasks.due_at.asc())

    get_today = db.scalars(query).all()

    return get_today



@router.get("/{id}", response_model=schemas.TasksCreateOutput)
def display_tasks_id(id: int, db: Session = Depends(get_db),
                     current_user: models.Users = Depends(get_current_user)):

    query = select(models.Tasks).where(models.Tasks.id == id)

    show_task_id = db.scalars(query).first()

    if not show_task_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail="Task was not found")

    if show_task_id.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, 
                            detail="You don't have access")

    return show_task_id


@router.patch("/{id}", response_model=schemas.TasksUpdateResponse)
def update_tasks(id: int, task: schemas.TasksUpdate , db: Session = Depends(get_db), 
                current_user: models.Users = Depends(get_current_user)):

    query = select(models.Tasks).where(models.Tasks.id == id)

    update_tasks_id = db.scalars(query).first()

    if not update_tasks_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                             detail="Task was not found")

    if update_tasks_id.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, 
                            detail="You don't have access")

    for key, value in task.model_dump(exclude_unset=True, 
                                      exclude_none=True).items():
        setattr(update_tasks_id, key, value)


    db.commit()
    db.refresh(update_tasks_id)

    return update_tasks_id


@router.delete("/{id}")
def delete_tasks(id: int, db: Session = Depends(get_db), 
                 current_user: models.Users = Depends(get_current_user)):

    query = select(models.Tasks).where(models.Tasks.id == id)

    delete_tasks_id = db.scalars(query).first()

    if not delete_tasks_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                                     detail="Task was not found")

    if delete_tasks_id.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, 
                                detail="You don't have access")

    db.delete(delete_tasks_id)
    db.commit()

    return {"message": "Deleted successfully"}



