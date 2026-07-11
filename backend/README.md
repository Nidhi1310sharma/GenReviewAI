# GenReview AI — Backend

FastAPI backend, built module by module per the agreed roadmap.

## Status: Module 1 complete (Project Setup)

- [x] FastAPI app boots (`app/main.py`)
- [x] PostgreSQL connection via SQLAlchemy (`app/database/`)
- [x] Alembic wired up and pointed at the same settings as the app (`alembic/`)
- [x] Config loaded from `.env` (`app/config/settings.py`)
- [x] Full folder structure in place, matching the agreed backend design
- [x] Every router mounted with a `/ping` stub, proving the wiring works
- [x] Sentiment model (`ml/*.pkl`) loads and predicts correctly through `sentiment_service.py`
- [ ] Module 2 — Auth (JWT, password hashing, role-based access)
- [ ] Module 3 — Business APIs
- [ ] Module 4 — Customer APIs (QR scan, rating, review submission)
- [ ] Module 5 — AI Service: wire `POST /ai/predict` to `sentiment_service.py` (already works, just not routed) + build priority prediction
- [ ] Module 6 — Review Draft AI (Claude API integration)
- [ ] Module 7 — Dashboards + email alerts

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env              # then fill in your real DATABASE_URL etc.
```

You'll need a running PostgreSQL instance. Quickest local option:

```bash
docker run --name genreview-db -e POSTGRES_USER=genreview_user \
  -e POSTGRES_PASSWORD=genreview_pass -e POSTGRES_DB=genreview_db \
  -p 5432:5432 -d postgres:16
```

That matches the default `DATABASE_URL` in `.env.example` — adjust both together if you use different credentials.

## Run it

```bash
uvicorn app.main:app --reload
```

- App: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health (works even without a DB connection)
- Every router's stub check: e.g. http://localhost:8000/api/v1/auth/ping

## Run the tests

```bash
pytest
```

Both tests pass without a live database — they only prove the app boots and every router is mounted correctly, which is all Module 1 promises.

## Migrations (Alembic)

Once real models exist in `app/models/` (Module 3+):

```bash
alembic revision --autogenerate -m "add business and user tables"
alembic upgrade head
```

`alembic/env.py` reads `DATABASE_URL` from the same `.env` as the app, so there's only one place the connection string lives.

## Folder structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, router mounting, DB health check on boot
│   ├── config/               # Settings loaded from .env
│   ├── database/             # Engine, session, declarative Base
│   ├── models/                # SQLAlchemy models — empty, filled in Module 3+
│   ├── schemas/               # Pydantic schemas — empty, filled in Module 2+
│   ├── routers/                # One file per resource — all stubbed with /ping for now
│   ├── services/                # Business logic — sentiment_service.py already works end-to-end
│   ├── utils/, middleware/, dependencies/  # empty, filled in as needed
├── ml/                        # Trained sentiment model artifacts (already working)
│   ├── best_sentiment_model.pkl   # Logistic Regression, 79.3% accuracy
│   ├── tfidf_vectorizer.pkl
│   ├── label_encoder.pkl
│   └── model_metadata.json
├── alembic/                   # Migrations, wired to app/config
├── uploads/                    # For future file uploads (QR assets, etc.)
├── tests/
└── requirements.txt
```

## A note on the sentiment model

`ml/*.pkl` were trained with scikit-learn 1.5.1 (see `model_metadata.json`).
`requirements.txt` pins the same version so you won't get
`InconsistentVersionWarning` on load. If you retrain the model with a newer
scikit-learn, bump this pin to match.

Try it directly, no server needed:

```bash
python3 -c "
from app.services.sentiment_service import predict_sentiment
print(predict_sentiment('The food was great but service was slow.'))
"
```
