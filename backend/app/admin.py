from sqladmin import Admin, ModelView, BaseView, expose, action
from app.models.user import User
from app.models.provider import Provider
from app.models.category import Category
from app.models.request import Request
from app.models.quote import Quote
from app.models.service import ProviderService
from sqlalchemy import func


class DashboardView(BaseView):
    name = "Дашборд"
    icon = "fa-solid fa-chart-line"

    @expose("/dashboard", methods=["GET"])
    async def dashboard(self, request):
        db = SessionLocal()
        try:
            user_count = db.query(User).count()
            provider_count = db.query(Provider).count()
            request_count = db.query(Request).count()
            pending_requests = db.query(Request).filter(Request.status == "pending").count()
            
            return await self.templates.TemplateResponse(
                request, 
                "dashboard.html", 
                context={
                    "user_count": user_count,
                    "provider_count": provider_count,
                    "request_count": request_count,
                    "pending_requests": pending_requests
                }
            )
        finally:
            db.close()


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

    @action(
        name="ban_user",
        label="Заблокировать",
        confirmation_message="Вы уверены, что хотите заблокировать выбранных пользователей?",
        add_in_detail=True,
        add_in_list=True
    )
    async def ban_user(self, request: Request):
        pks = request.query_params.get("pks", "").split(",")
        if pks:
            db = SessionLocal()
            try:
                for pk in pks:
                    model = db.query(User).get(int(pk))
                    if model:
                        model.is_active = False
                db.commit()
            finally:
                db.close()
        return RedirectResponse(request.url_for("admin:list", identity="user"), status_code=302)

    @action(
        name="activate_user",
        label="Активировать",
        confirmation_message="Активировать выбранных пользователей?",
        add_in_detail=True,
        add_in_list=True
    )
    async def activate_user(self, request: Request):
        pks = request.query_params.get("pks", "").split(",")
        if pks:
            db = SessionLocal()
            try:
                for pk in pks:
                    model = db.query(User).get(int(pk))
                    if model:
                        model.is_active = True
                db.commit()
            finally:
                db.close()
        return RedirectResponse(request.url_for("admin:list", identity="user"), status_code=302)


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

    @action(
        name="cancel_request",
        label="Отменить заявку",
        confirmation_message="Вы уверены, что хотите отменить выбранные заявки?",
        add_in_detail=True,
        add_in_list=True
    )
    async def cancel_request(self, request: Request):
        pks = request.query_params.get("pks", "").split(",")
        if pks:
            db = SessionLocal()
            try:
                for pk in pks:
                    model = db.query(Request).get(int(pk))
                    if model:
                        model.status = "cancelled"
                db.commit()
            finally:
                db.close()
        return RedirectResponse(request.url_for("admin:list", identity="request"), status_code=302)


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


from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from starlette.responses import RedirectResponse
from app.core.security import verify_password
from app.db.session import SessionLocal

class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        email = form.get("username")
        password = form.get("password")

        db = SessionLocal()
        try:
            user = db.query(User).filter(User.email == email).first()
            
            if not user or not verify_password(password, user.hashed_password):
                return False
                
            if not user.is_superuser:
                return False

            # Store user ID in session
            request.session.update({"token": str(user.id)})
            return True
        finally:
            db.close()

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")
        if not token:
            return False
            
        # Verify user still exists and is superuser
        # This ensures that if a user is banned/demoted, they lose access immediately
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.id == int(token)).first()
            if not user or not user.is_active or not user.is_superuser:
                # Invalid user, clear session
                request.session.clear()
                return False
            return True
        except Exception:
            return False
        finally:
            db.close()

def setup_admin(app, engine):
    """Setup SQLAdmin with all model views"""
    from app.core.config import settings
    
    authentication_backend = AdminAuth(secret_key=settings.SECRET_KEY)
    
    admin = Admin(
        app=app, 
        engine=engine,
        title="FindPro Admin",
        authentication_backend=authentication_backend,
        templates_dir="app/templates" # Ensure we can load custom templates
    )
    
    # Register all model views
    admin.add_view(DashboardView) # Register Dashboard
    admin.add_view(UserAdmin)
    admin.add_view(ProviderAdmin)
    admin.add_view(CategoryAdmin)
    admin.add_view(RequestAdmin)
    admin.add_view(QuoteAdmin)
    admin.add_view(ServiceAdmin)
    
    return admin
