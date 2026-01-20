from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint_ok():
  """Проверяем, что health-check живой и возвращает ожидаемый формат."""
  response = client.get("/health")
  assert response.status_code == 200
  data = response.json()
  assert data.get("status") == "OK"

