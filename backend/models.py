from. database import Base
from sqlalchemy import Column, Integer, String, TIMESTAMP, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class Users(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    tasks = relationship("Tasks", back_populates="user")



class Tasks(Base):

    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, nullable=False)
    title= Column(String, nullable=False)
    description = Column(String, nullable=False)
    due_at = Column(DateTime(timezone=True), nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("Users", back_populates="tasks")

