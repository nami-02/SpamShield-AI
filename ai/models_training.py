import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import os
import sys

sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "backend")
    )
)
from analyzer.feature_extractor import extract_features


# Load dataset (look locally first, then fall back to ../dataset)
local_dataset = os.path.join(os.path.dirname(__file__), "phishing_urls.csv")
fallback_dataset = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset", "phishing_urls.csv"))
dataset_path = local_dataset if os.path.exists(local_dataset) else fallback_dataset
df = pd.read_csv(dataset_path)

# Check required columns
if "url" not in df.columns or "label" not in df.columns:
    raise ValueError("Dataset must contain 'url' and 'label' columns.")

# Extract features
X = df["url"].apply(extract_features)
X = pd.DataFrame(list(X))

# Labels
y = df["label"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Train model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, predictions))
print()
print(classification_report(y_test, predictions))

# Ensure models output directory exists and save model
models_dir = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(models_dir, exist_ok=True)
joblib.dump(model, os.path.join(models_dir, "phishing_model.pkl"))

print("\nModel saved successfully!")