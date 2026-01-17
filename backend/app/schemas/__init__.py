from pydantic import BaseModel

# Import all schemas to make them available when importing from app.schemas
from .user import User, UserCreate, UserInDB, UserUpdate, UserUpdateMe
from .token import Token, Login, TokenPayload, PasswordReset, PasswordResetRequest
from .request import Request, RequestCreate, RequestUpdate, RequestStatus
from .quote import Quote, QuoteCreate, QuoteUpdate, QuoteStatus
from .review import Review, ReviewCreate
from .provider import Provider, ProviderCreate, ProviderInDB, ProviderUpdate
from .category import Category, CategoryCreate, CategoryInDB, CategoryUpdate
from .service import Service, ServiceCreate, ServiceInDB, ServiceUpdate
from .notification import Notification, NotificationCreate, NotificationUpdate

# Common response models
class Msg(BaseModel):
    msg: str
