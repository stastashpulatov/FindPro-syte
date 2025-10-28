from sqladmin import Admin, ModelView
from app.models.user import User
from app.models.provider import Provider
from app.models.category import Category
from app.models.request import Request
from app.models.quote import Quote
from app.models.service import ProviderService


class UserAdmin(ModelView, model=User):
    name = "Пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-user"
    
    column_list = [User.id, User.email, User.full_name, User.is_active, User.is_superuser, User.created_at]
    column_searchable_list = [User.email, User.full_name]
    column_sortable_list = [User.id, User.email, User.created_at]
    column_default_sort = [(User.created_at, True)]
    
    form_excluded_columns = [User.hashed_password, User.created_at, User.updated_at]
    
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True


class ProviderAdmin(ModelView, model=Provider):
    name = "Специалист"
    name_plural = "Специалисты"
    icon = "fa-solid fa-briefcase"
    
    column_list = [
        Provider.id, 
        Provider.user_id, 
        Provider.company_name, 
        Provider.rating,
        Provider.is_verified,
        Provider.created_at
    ]
    column_searchable_list = [Provider.company_name, Provider.description]
    column_sortable_list = [Provider.id, Provider.rating, Provider.created_at]
    column_default_sort = [(Provider.created_at, True)]
    
    form_excluded_columns = [Provider.created_at, Provider.updated_at]
    
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True


class CategoryAdmin(ModelView, model=Category):
    name = "Категория"
    name_plural = "Категории"
    icon = "fa-solid fa-tags"
    
    column_list = [Category.id, Category.name, Category.description, Category.icon]
    column_searchable_list = [Category.name, Category.description]
    column_sortable_list = [Category.id, Category.name]
    
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True


class RequestAdmin(ModelView, model=Request):
    name = "Заявка"
    name_plural = "Заявки"
    icon = "fa-solid fa-clipboard-list"
    
    column_list = [
        Request.id,
        Request.user_id,
        Request.category_id,
        Request.title,
        Request.status,
        Request.created_at
    ]
    column_searchable_list = [Request.title, Request.description]
    column_sortable_list = [Request.id, Request.status, Request.created_at]
    column_default_sort = [(Request.created_at, True)]
    
    form_excluded_columns = [Request.created_at, Request.updated_at]
    
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True


class QuoteAdmin(ModelView, model=Quote):
    name = "Предложение"
    name_plural = "Предложения"
    icon = "fa-solid fa-file-invoice-dollar"
    
    column_list = [
        Quote.id,
        Quote.request_id,
        Quote.provider_id,
        Quote.amount,
        Quote.status,
        Quote.created_at
    ]
    column_searchable_list = [Quote.message]
    column_sortable_list = [Quote.id, Quote.amount, Quote.status, Quote.created_at]
    column_default_sort = [(Quote.created_at, True)]
    
    form_excluded_columns = [Quote.created_at, Quote.updated_at]
    
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True


class ServiceAdmin(ModelView, model=ProviderService):
    name = "Услуга"
    name_plural = "Услуги"
    icon = "fa-solid fa-wrench"
    
    column_list = [
        ProviderService.id,
        ProviderService.provider_id,
        ProviderService.category_id,
        ProviderService.title,
        ProviderService.price,
        ProviderService.is_available
    ]
    column_searchable_list = [ProviderService.title, ProviderService.description]
    column_sortable_list = [ProviderService.id, ProviderService.price]
    
    form_excluded_columns = [ProviderService.created_at, ProviderService.updated_at]
    
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True


def setup_admin(app, engine):
    """Setup SQLAdmin with all model views"""
    admin = Admin(
        app=app, 
        engine=engine,
        title="FindPro Admin"
    )
    
    # Register all model views
    admin.add_view(UserAdmin)
    admin.add_view(ProviderAdmin)
    admin.add_view(CategoryAdmin)
    admin.add_view(RequestAdmin)
    admin.add_view(QuoteAdmin)
    admin.add_view(ServiceAdmin)
    
    return admin
