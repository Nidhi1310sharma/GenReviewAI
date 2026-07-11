"""
Generates and resolves per-business QR codes (PRD section 7.1 / 6.3).

Status: STUB — folder wired up in Module 1. Real implementation
(qrcode library, asset storage, short-link resolution) lands in Module 4.
"""


def generate_qr(business_id: str) -> bytes:
    """TODO (Module 4): generate a QR code image pointing at the customer
    landing page for this business, save it, return the image bytes."""
    raise NotImplementedError("QR generation — build in Module 4.")


def resolve_qr(qr_id: str) -> str:
    """TODO (Module 4): look up which business a scanned QR code belongs to."""
    raise NotImplementedError("QR resolution — build in Module 4.")
