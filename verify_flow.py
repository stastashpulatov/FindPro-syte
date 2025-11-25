import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def register_user(email, password, full_name, role="client"):
    url = f"{BASE_URL}/auth/register"
    data = {
        "email": email,
        "password": password,
        "full_name": full_name,
        "phone_number": "+998901234567"
    }
    # If worker, we might need to do more, but let's start with basic register
    # The system seems to separate user creation and provider profile creation?
    # Let's check how the frontend does it. 
    # Frontend just calls /auth/register. 
    # If worker, they probably need to create a provider profile later?
    # Let's assume basic registration for now.
    response = requests.post(url, json=data)
    if response.status_code == 201:
        return response.json()
    elif response.status_code == 400 and "already exists" in response.text:
        print(f"User {email} already exists, proceeding to login.")
        return None
    else:
        print(f"Failed to register {email}: {response.text}")
        sys.exit(1)

def login(email, password):
    url = f"{BASE_URL}/auth/login"
    data = {
        "username": email,
        "password": password
    }
    response = requests.post(url, data=data)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(f"Failed to login {email}: {response.text}")
        sys.exit(1)

def create_provider_profile(token):
    url = f"{BASE_URL}/providers/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "category_id": 1, # Assuming category 1 exists
        "experience_years": 5,
        "bio": "Expert worker",
        "hourly_rate": 50000
    }
    # Check if already provider
    me_url = f"{BASE_URL}/users/me"
    me_res = requests.get(me_url, headers=headers)
    if me_res.json().get("is_provider"):
        print("User is already a provider.")
        return me_res.json()["provider"]["id"]

    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        return response.json()["id"]
    else:
        # It might fail if category 1 doesn't exist. Let's list categories first.
        cats = requests.get(f"{BASE_URL}/categories/", headers=headers).json()
        if cats:
            data["category_id"] = cats[0]["id"]
            response = requests.post(url, json=data, headers=headers)
            if response.status_code == 200:
                return response.json()["id"]
        
        print(f"Failed to create provider profile: {response.text}")
        sys.exit(1)

def main():
    print("Starting verification...")

    # 1. Customer Setup
    cust_email = "test_cust_flow@example.com"
    cust_pass = "password123"
    register_user(cust_email, cust_pass, "Test Customer")
    cust_token = login(cust_email, cust_pass)
    print("Customer logged in.")

    # 2. Worker Setup
    work_email = "test_work_flow@example.com"
    work_pass = "password123"
    register_user(work_email, work_pass, "Test Worker")
    work_token = login(work_email, work_pass)
    print("Worker logged in.")
    
    # Ensure worker has provider profile
    provider_id = create_provider_profile(work_token)
    print(f"Worker provider profile active. ID: {provider_id}")

    # 3. Create Request (Customer)
    print("Creating request...")
    req_url = f"{BASE_URL}/requests/"
    headers_cust = {"Authorization": f"Bearer {cust_token}"}
    
    # Get a category
    cats = requests.get(f"{BASE_URL}/categories/", headers=headers_cust).json()
    if not cats:
        print("No categories found. Cannot create request.")
        sys.exit(1)
    cat_id = cats[0]["id"]

    req_data = {
        "title": "Test Request Flow",
        "description": "Need help with testing",
        "category_id": cat_id,
        "price": 100000,
        "latitude": 41.0,
        "longitude": 69.0,
        "address": "Test Address",
        "scheduled_date": "2025-12-01T10:00:00"
    }
    req_res = requests.post(req_url, json=req_data, headers=headers_cust)
    if req_res.status_code != 200:
        print(f"Failed to create request: {req_res.text}")
        sys.exit(1)
    request_id = req_res.json()["id"]
    print(f"Request created. ID: {request_id}")

    # 4. Find Request (Worker)
    print("Worker searching for request...")
    headers_work = {"Authorization": f"Bearer {work_token}"}
    all_reqs = requests.get(req_url, headers=headers_work).json()
    
    found = False
    for r in all_reqs:
        if r["id"] == request_id:
            found = True
            break
    
    if found:
        print("Worker found the request!")
    else:
        print("Worker could NOT find the request. Permission issue?")
        # Debug: print all requests seen
        # print(json.dumps(all_reqs, indent=2))
        sys.exit(1)

    # 5. Apply (Worker)
    print("Worker applying...")
    quote_url = f"{BASE_URL}/quotes/"
    quote_data = {
        "request_id": request_id,
        "provider_id": provider_id,
        "price": 90000,
        "days_to_complete": 2,
        "message": "I can do it!"
    }
    quote_res = requests.post(quote_url, json=quote_data, headers=headers_work)
    if quote_res.status_code != 200:
        print(f"Failed to create quote: {quote_res.text}")
        sys.exit(1)
    quote_id = quote_res.json()["id"]
    print(f"Quote created. ID: {quote_id}")

    # 6. View Proposals (Customer)
    print("Customer viewing proposals...")
    # The endpoint to get quotes for a request might be /quotes/?request_id=... or filtered in list
    # Based on quotes.py read_quotes, it returns all quotes visible to user.
    quotes_res = requests.get(quote_url, headers=headers_cust)
    cust_quotes = quotes_res.json()
    
    quote_found = False
    for q in cust_quotes:
        if q["id"] == quote_id:
            quote_found = True
            break
            
    if quote_found:
        print("Customer saw the quote!")
    else:
        print("Customer could NOT see the quote.")
        sys.exit(1)

    # 7. Accept Quote (Customer)
    print("Customer accepting quote...")
    accept_url = f"{BASE_URL}/quotes/{quote_id}/accept"
    accept_res = requests.post(accept_url, headers=headers_cust)
    if accept_res.status_code != 200:
        print(f"Failed to accept quote: {accept_res.text}")
        sys.exit(1)
    print("Quote accepted.")

    # 8. Verify Request Status
    print("Verifying request status...")
    final_req = requests.get(f"{BASE_URL}/requests/{request_id}", headers=headers_cust).json()
    if final_req["status"] == "in_progress":
        print("SUCCESS: Request is in_progress.")
    else:
        print(f"FAILURE: Request status is {final_req['status']}")
        sys.exit(1)

if __name__ == "__main__":
    main()
