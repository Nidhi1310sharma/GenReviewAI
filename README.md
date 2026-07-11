# GenReview AI — Full Project

Everything in one place: existing frontend, existing sentiment model work,
and the new backend scaffold (Module 1).

```
GenReviewAI-Project/
├── frontend/          # Existing — 3 portals (customer, owner, admin), static HTML/CSS/JS
├── data-science/       # Existing — notebooks + trained sentiment model (source of truth)
├── backend/            # NEW — FastAPI backend, Module 1 (project setup) complete
└── README.md           # This file
```

## What's where

### `frontend/`
Unchanged from what you had. Three portals, currently running on `shared/mock-data.js`:
- `admin/` — fully built
- `owner/` — fully built
- `customer/` — `landing.html`, `tags.html`, `rating.html` built; `review.html`,
  `feedback.html`, `thankyou.html` are still empty placeholders

No `fetch()` calls exist yet anywhere — that's what Module 2+ on the backend enables.

### `data-science/`
Unchanged from what you had. The 3 notebooks (data cleaning → NLP preprocessing →
feature engineering/training) and the trained artifacts in `models/classical/`.
This is your source of truth for the model — `backend/ml/` is a **copy** of the
same `.pkl` files so the backend doesn't depend on this folder at runtime.

### `backend/` — NEW
Module 1 of the roadmap your head laid out: FastAPI + PostgreSQL + SQLAlchemy +
Alembic, full folder structure, every router mounted (as stubs), and the
sentiment model already loading and predicting correctly through
`services/sentiment_service.py`. See `backend/README.md` for setup and run
instructions — it's a real, tested, runnable app, not just empty folders.

## What's next

Module 2 (Auth) onward, one module at a time, same as we discussed. The
folder structure and mount points already in `backend/` won't need to
change — each module just fills in real logic behind the existing stub
routes.
