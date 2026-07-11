"""
Sends owner alert emails (low-rating alerts, daily/weekly digests — PRD
section 6.2 / 7.6).

Status: STUB — folder wired up in Module 1. Real implementation
(fastapi-mail + SMTP settings from .env) lands in Module 7.
"""


def send_low_rating_alert(owner_email: str, business_name: str, rating: int, feedback_text: str) -> None:
    """TODO (Module 7): send the owner a same-minute alert on a below-threshold rating."""
    raise NotImplementedError("Email alerts — build in Module 7.")
