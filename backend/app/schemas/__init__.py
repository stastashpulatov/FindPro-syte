from pydantic import BaseModel

# Import all schemas to make them available when importing from app.schemas
from .user import User, UserCreate, UserInDB, UserUpdate
from .token import Token, Login, TokenPayload, PasswordReset, PasswordResetRequest
from .request import Request, RequestCreate, RequestInDB, RequestUpdate, RequestStatus
from .quote import Quote, QuoteCreate, QuoteInDB, QuoteUpdate, QuoteStatus
from .provider import Provider, ProviderCreate, ProviderInDB, ProviderUpdate
from .category import Category, CategoryCreate, CategoryInDB, CategoryUpdate
from .service import Service, ServiceCreate, ServiceInDB, ServiceUpdate

# Common response models
class Msg(BaseModel):
    msg: str
