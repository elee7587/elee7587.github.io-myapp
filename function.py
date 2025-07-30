import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

def build_sentiment_model():
    return Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english', ngram_range=(1, 2))),
        ('clf', LogisticRegression(class_weight='balanced', max_iter=1000))
    ])

def train_and_predict(train_reviews, train_labels, test_reviews):
    model = build_sentiment_model()
    model.fit(train_reviews, train_labels)
    return model.predict(test_reviews)

def process_data(df):
    """
    Processes the DataFrame using only 'review' and 'label' columns.
    Returns: A list of (restaurant_name, prediction) for test samples.
    """

    if 'review' not in df.columns or 'label' not in df.columns:
        raise ValueError("DataFrame must contain 'review' and 'label' columns.")

    # Replace string '[None]' with actual np.nan
    df['label'] = df['label'].replace("[None]", np.nan)

    train_df = df[df['label'].notna()].reset_index(drop=True)
    test_df = df[df['label'].isna()].reset_index(drop=True)

    if train_df.empty:
        raise ValueError("No training data with labels found.")
    if test_df.empty:
        raise ValueError("No test data with missing labels found.")

    # Ensure 'restaurant' column exists
    if 'restaurant' not in test_df.columns:
        test_df['restaurant'] = "Unknown"

    train_reviews = train_df['review'].astype(str).tolist()
    test_reviews = test_df['review'].astype(str).tolist()
    train_labels = train_df['label'].astype(int).tolist()

    predictions = train_and_predict(train_reviews, train_labels, test_reviews)

    return list(zip(test_df['restaurant'], predictions.tolist()))
