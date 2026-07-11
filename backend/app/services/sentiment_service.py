"""
Wraps the trained classical sentiment model (TF-IDF + Logistic Regression,
79.3% test accuracy — see ../../ml/model_metadata.json) so routers can call
a single predict() function instead of touching pickle files directly.

Status: STUB — Module 1 only ships the folder + the load-path plumbing.
Full implementation (predict + priority-mapping) lands in Module 5.
"""
from functools import lru_cache
import pickle

from app.config import get_settings

settings = get_settings()


@lru_cache
def _load_artifacts():
    """
    Loads the model, vectorizer, and label encoder once per process.
    Cached because unpickling on every request would be wasteful — these
    files don't change at runtime.
    """
    with open(settings.sentiment_model_path, "rb") as f:
        model = pickle.load(f)
    with open(settings.tfidf_vectorizer_path, "rb") as f:
        vectorizer = pickle.load(f)
    with open(settings.label_encoder_path, "rb") as f:
        label_encoder = pickle.load(f)
    return model, vectorizer, label_encoder


def predict_sentiment(text: str) -> str:
    """
    TODO (Module 5): this works today (model, vectorizer, and encoder are
    already trained and included in ml/), but is not yet wired to any
    router. POST /ai/predict in routers/ai.py should call this.
    """
    model, vectorizer, label_encoder = _load_artifacts()
    X = vectorizer.transform([text])
    prediction = model.predict(X)
    return label_encoder.inverse_transform(prediction)[0]


def predict_priority(sentiment: str, star_rating: int, text: str) -> str:
    """
    TODO (Module 5): priority isn't a trained model yet (see the hybrid
    architecture diagram) — this is a placeholder rule-based stub so the
    function signature exists. Replace the body with real logic, or a
    second trained model, when Module 5 is built.
    """
    raise NotImplementedError("Priority prediction logic — build in Module 5.")
