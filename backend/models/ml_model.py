import os
import joblib
import pandas as pd

MODEL_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "ai",
        "models",
        "phishing_model.pkl"
    )
)

model = joblib.load(MODEL_PATH)


def predict(features):
    df = pd.DataFrame([features])

    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0]

    return {
        "prediction": int(prediction),
        "confidence": round(max(probability) * 100, 2)
    }