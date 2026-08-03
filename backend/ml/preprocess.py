import re
import string

# Stop words list for lightweight preprocessing without heavy download dependencies
STOP_WORDS = set([
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours",
    "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers",
    "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves",
    "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are",
    "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does",
    "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until",
    "while", "of", "at", "by", "for", "with", "about", "against", "between", "into",
    "through", "during", "before", "after", "above", "below", "to", "from", "up", "down",
    "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here",
    "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more",
    "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
    "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"
])

def clean_text(text: str) -> str:
    """
    Step 1 AI Pipeline: Clean and normalize raw text.
    - Removes HTML tags
    - Removes URLs
    - Removes Emojis & non-ASCII characters
    - Lowercases text
    - Removes punctuation
    - Removes extra spaces and stop words
    """
    if not text or not isinstance(text, str):
        return ""
    
    # 1. Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    
    # 2. Remove URLs
    text = re.sub(r'http[s]?://\S+|www\.\S+', ' ', text)
    
    # 3. Remove Emojis & non-ASCII characters
    text = text.encode('ascii', 'ignore').decode('ascii')
    
    # 4. Convert to lower case
    text = text.lower()
    
    # 5. Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # 6. Tokenize & remove stop words
    tokens = text.split()
    filtered_tokens = [word for word in tokens if word not in STOP_WORDS and len(word) > 2]
    
    # 7. Normalize whitespace
    return " ".join(filtered_tokens)


def extract_nlp_features(text: str) -> dict:
    """
    Extract linguistic and stylistic indicators from text.
    """
    raw_words = text.split()
    total_words = len(raw_words) if raw_words else 1
    
    # Count uppercase words (Sensationalism/Clickbait indicator)
    caps_count = sum(1 for w in raw_words if w.isupper() and len(w) > 1)
    caps_ratio = round((caps_count / total_words) * 100, 2)
    
    # Exclamation & Question marks count
    exclamations = text.count('!')
    questions = text.count('?')
    
    # Sensational / Emotional Trigger Words
    sensational_words = [
        "shocking", "unbelievable", "secret", "exposed", "miracle", "conspiracy",
        "they don't want you to know", "viral", "banned", "truth behind", "bombshell",
        "warning", "hidden", "urgent", "must see", "guaranteed", "uncovered"
    ]
    
    text_lower = text.lower()
    found_triggers = [w for w in sensational_words if w in text_lower]
    sensational_score = round(min(100.0, (len(found_triggers) * 20.0) + (caps_ratio * 1.5) + (exclamations * 5)), 2)
    
    return {
        "word_count": total_words,
        "caps_ratio": caps_ratio,
        "exclamations": exclamations,
        "questions": questions,
        "sensational_score": sensational_score,
        "triggered_words": found_triggers
    }
