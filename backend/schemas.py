from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from datetime import datetime, timezone, timedelta
from typing import Optional



# ------- Users -----------
class UsersCreate(BaseModel):

    username: str
    email: EmailStr
    password: str

class UsersCreateOutput(BaseModel):

    id: int 
    username: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UsersUpdate(BaseModel):

    username: Optional[str] = None
    email: Optional[EmailStr] = None

class UsersUpdateOutput(UsersUpdate):

    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ------- Login -----------

class Login(BaseModel):

    email: EmailStr
    password: str


# ------- Tasks -----------
VN_TZ = timezone(timedelta(hours=7))

class TasksBase(BaseModel):

    title: str
    description: str
    due_at: datetime
    completed: bool = False

class TasksCreate(TasksBase):

    title: str = Field(min_length=1)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):

        value = value.strip()

        if value == "":
            raise ValueError("Title cannot be empty")
        
        return value

    description: str
    due_at: datetime

    @field_validator("due_at")
    @classmethod
    def validate_dueat(cls, value):

        if value is None:
            return value

        if value.tzinfo is None:
            raise ValueError("due_at must include timezone")
    
        if value < datetime.now(VN_TZ):
           raise ValueError("Due at error ")

        return value

class TasksCreateOutput(TasksBase):

    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TasksUpdate(TasksBase):

    title: Optional[str] = Field(default=None, min_length=1)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):

        if value is None:
            return value
        
        value = value.strip()
    
        if not value:
            raise ValueError("Title cannot be empty")
            
        return value
    
    description: Optional[str] = None
    due_at: Optional[datetime] = None

    @field_validator("due_at")
    @classmethod
    def validate_dueat(cls, value):

        if value is None:
            return value

        if value.tzinfo is None:
            raise ValueError("due_at must include timezone")

        if value < datetime.now(VN_TZ):
            raise ValueError("Due at error")

        return value

    completed: Optional[bool] = None

class TasksUpdateResponse(TasksBase):

    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)