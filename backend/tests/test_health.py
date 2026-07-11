"""
Smoke tests for Module 1: proves the app boots and every router is mounted,
even though each router's real logic doesn't exist yet.
"""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_all_stub_routers_are_mounted():
    for path in [
        "/api/v1/auth/ping",
        "/api/v1/admin/ping",
        "/api/v1/owner/ping",
        "/api/v1/customer/ping",
        "/api/v1/reviews/ping",
        "/api/v1/qr/ping",
        "/api/v1/analytics/ping",
        "/api/v1/ai/ping",
    ]:
        response = client.get(path)
        assert response.status_code == 200, f"{path} not mounted correctly"
