import os
import joblib
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, PassiveAggressiveClassifier
from sklearn.ensemble import RandomForestClassifier, VotingClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from preprocess import clean_text

SAVED_MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

# Extended dataset representing authentic & deceptive news patterns
SAMPLE_DATASET = [
    # REAL NEWS SAMPLES (Label: 0)
    ("The Federal Reserve announced an interest rate adjustment following quarterly inflation metrics review.", 0),
    ("NASA's Artemis program successfully completes orbital test maneuvers near the lunar surface.", 0),
    ("The World Health Organization releases updated guidelines on seasonal flu vaccination campaigns.", 0),
    ("European Union leaders convene in Brussels to discuss new climate target commitments for 2030.", 0),
    ("Researchers at MIT develop a novel solar cell technology achieving 28% efficiency in lab trials.", 0),
    ("Global semiconductor shipments increased by 4.2% in the second quarter according to industry data.", 0),
    ("The United Nations Security Council unanimously passes resolution supporting humanitarian corridor relief.", 0),
    ("Stock market indexes remained stable today following corporate earnings reports from major tech firms.", 0),
    ("Department of Transportation releases funding for highway bridge repair infrastructure across 12 states.", 0),
    ("Scientists discover new deep-sea coral reef species during Pacific oceanographic expedition.", 0),
    ("The Ministry of Health confirms nationwide vaccination campaign has reduced hospital admission rates.", 0),
    ("Central bank governors express cautious optimism about stabilizing energy commodity prices.", 0),
    ("Civil engineering teams complete construction on the country's largest offshore wind farm installation.", 0),
    ("Peer-reviewed medical journal publishes clinical trial results for target oncology treatment.", 0),
    ("Bureau of Labor Statistics reports a 0.2 percent decrease in nationwide unemployment figures.", 0),

    # FAKE NEWS SAMPLES (Label: 1)
    ("SHOCKING: Secret Miracle Cure for All Diseases Hidden by Pharmaceutical Giants Exposed Today!", 1),
    ("ALERT: Secret Government Alien Telepathy Satellite Network Secretly Activated World Wide!", 1),
    ("BOMBSHELL: Celebrity Admits Drinking Fountain of Youth Elixir to Live 200 Years Virus Uncovered!", 1),
    ("BANNED TRUTH: Drinking Banana Peel Tea Cures All Financial Problems and Reverses Aging Instantly!", 1),
    ("LEAKED DOCUMENTS Prove Millions of Microchips Inserted into Bottled Water by Secret Society!", 1),
    ("BREAKING: Scientists Confirm Moon is Made of Concentrated Cheese and Fake CGI Projections!", 1),
    ("URGENT: Drinking 5 Liters of Ocean Water Guarantees Immunity to All Known Pathogens Immediately!", 1),
    ("EXPOSED: Secret Underground Reptilian Base Found Under Main Street Bank Vault Never Seen Before!", 1),
    ("MUST SEE: Drinking Miracle Juice Grows New Teeth in 24 Hours Dentists Are Furious!", 1),
    ("VIRAL ALERT: Secret Code Hidden in Supermarket Receipts Transmits Your Thoughts to Outer Space!", 1),
    ("GOVERNMENT COVERUP: 5G Towers Are Stealing Your Dreams and Replacing Them with Commercial Ads!", 1),
    ("SHOCKING REVELATION: Ancient Pyramid Discovered Inside Ordinary Microwave Oven Exposed!", 1),
    ("BOMBSHELL EVIDENCE: Millions of Ghosts Registered to Vote in Recent Local Mayor Election!", 1),
    ("WARNING: Secret Formula Turns Tap Water Into Pure Gold But Big Oil Keeps It Hidden!", 1),
    ("UNBELIEVABLE: Eating Raw Onions Grants Invisibility Powers Government Doesn't Want You to Know!", 1)
]

def train_and_save_model():
    print("=" * 60)
    print("AI Fake News Detector Model Training & Pipeline Serialization")
    print("=" * 60)

    # 1. Load data
    df = pd.DataFrame(SAMPLE_DATASET, columns=["text", "label"])
    
    # Expand dataset with realistic synthetic augmentations for robust TF-IDF training
    records = []
    for index, row in df.iterrows():
        records.append({"text": row["text"], "label": row["label"]})
        # Synthetic variants
        if row["label"] == 1:
            records.append({"text": "VIRAL WARNING! " + row["text"] + " MUST SHARE BEFORE DELETED!", "label": 1})
            records.append({"text": "EXPOSED: " + row["text"].lower() + " secret truth uncovered!", "label": 1})
        else:
            records.append({"text": "Official Report: " + row["text"], "label": 0})
            records.append({"text": row["text"] + " Officials confirmed in a press release.", "label": 0})

    df_full = pd.DataFrame(records)
    print(f"Total training dataset size: {len(df_full)} samples.")

    # 2. Preprocess text
    df_full["clean_text"] = df_full["text"].apply(clean_text)

    X = df_full["clean_text"]
    y = df_full["label"]

    # 3. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 4. Feature Extraction using TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=5000,
        sublinear_tf=True
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # 5. Build ML Models & Voting Ensemble
    clf1 = LogisticRegression(random_state=42, C=1.0)
    clf2 = RandomForestClassifier(n_estimators=100, random_state=42)
    clf3 = PassiveAggressiveClassifier(max_iter=1000, random_state=42)
    clf4 = GradientBoostingClassifier(n_estimators=50, random_state=42)

    # Voting ensemble using soft probabilities (or hard fallback)
    ensemble = VotingClassifier(
        estimators=[
            ('lr', clf1),
            ('rf', clf2),
            ('gb', clf4)
        ],
        voting='soft'
    )

    ensemble.fit(X_train_tfidf, y_train)

    # 6. Model Evaluation
    y_pred = ensemble.predict(X_test_tfidf)
    y_proba = ensemble.predict_proba(X_test_tfidf)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    auc = roc_auc_score(y_test, y_proba)
    cm = confusion_matrix(y_test, y_pred).tolist()

    print("\n--- MODEL PERFORMANCE METRICS ---")
    print(f"Accuracy:  {acc * 100:.2f}%")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall:    {rec * 100:.2f}%")
    print(f"F1-Score:  {f1 * 100:.2f}%")
    print(f"ROC AUC:   {auc:.4f}")
    print(f"Confusion Matrix: {cm}")

    # 7. Save Models
    vec_path = os.path.join(SAVED_MODELS_DIR, "tfidf_vectorizer.pkl")
    model_path = os.path.join(SAVED_MODELS_DIR, "fake_news_model.pkl")

    joblib.dump(vectorizer, vec_path)
    joblib.dump(ensemble, model_path)

    # Also save evaluation metrics report as JSON for Admin Dashboard display
    metrics = {
        "accuracy": round(acc * 100, 2),
        "precision": round(prec * 100, 2),
        "recall": round(rec * 100, 2),
        "f1_score": round(f1 * 100, 2),
        "roc_auc": round(auc, 4),
        "confusion_matrix": cm,
        "sample_count": len(df_full),
        "algorithms": ["Logistic Regression", "Random Forest", "Gradient Boosting", "Voting Ensemble"]
    }
    joblib.dump(metrics, os.path.join(SAVED_MODELS_DIR, "metrics.pkl"))

    print(f"\nSuccessfully serialized models to: {SAVED_MODELS_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    train_and_save_model()
