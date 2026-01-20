import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from app.models.quote import Quote
    from app.schemas.quote import QuoteCreate, QuoteUpdate
    
    print("Verification Start")
    
    # Check Model
    model_attrs = [c.name for c in Quote.__table__.columns]
    print(f"Model attributes: {model_attrs}")
    if 'price' in model_attrs and 'days_to_complete' in model_attrs and 'amount' not in model_attrs:
        print("✓ Quote Model: OK")
    else:
        print("✗ Quote Model: Failed")
        
    # Check Schema
    create_fields = QuoteCreate.__fields__.keys()
    print(f"QuoteCreate fields: {list(create_fields)}")
    if 'price' in create_fields and 'days_to_complete' in create_fields and 'amount' not in create_fields:
        print("✓ QuoteCreate Schema: OK")
    else:
        print("✗ QuoteCreate Schema: Failed")
        
    update_fields = QuoteUpdate.__fields__.keys()
    print(f"QuoteUpdate fields: {list(update_fields)}")
    if 'price' in update_fields and 'days_to_complete' in update_fields and 'amount' not in update_fields:
        print("✓ QuoteUpdate Schema: OK")
    else:
        print("✗ QuoteUpdate Schema: Failed")
        
    # Check API import (symbolic)
    from app.api.v1.endpoints.quotes import router
    print("✓ API Quotes Router: Imported successfully")
    
except ModuleNotFoundError as e:
    missing = getattr(e, "name", None) or str(e)
    print(f"✗ Verification Failed: missing dependency '{missing}'")
    print("")
    print("Как исправить:")
    print("  cd backend")
    print("  python -m venv .venv")
    print("  source .venv/bin/activate")
    print("  pip install -r requirements.txt")
    print("")
    print("После установки зависимостей запустите проверку снова:")
    print("  cd .. && python verify_backend.py")
except Exception as e:
    print(f"✗ Verification Failed with error: {str(e)}")
    import traceback
    traceback.print_exc()
