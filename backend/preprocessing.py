import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download NLTK data (run once)
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('tokenizers/punkt_tab')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('punkt_tab')
    nltk.download('stopwords')

stop_words = set(stopwords.words('english'))

def preprocess_text(text: str) -> str:
    """
    Cleans and preprocesses the input text.
    """
    if not isinstance(text, str):
        return ""
        
    # 1. Lowercase
    text = text.lower()
    
    # 2. Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # 3. Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    
    # 4. Remove punctuation and special characters
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # 5. Tokenize
    tokens = word_tokenize(text)
    
    # 6. Remove stopwords & numbers
    filtered_tokens = [word for word in tokens if word not in stop_words and word.isalpha()]
    
    # 7. Join back
    cleaned_text = ' '.join(filtered_tokens)
    
    return cleaned_text

def extract_important_terms(cleaned_text: str, top_n: int = 5) -> list:
    # A simple term extraction for the UI (just returning top words)
    words = cleaned_text.split()
    from collections import Counter
    counts = Counter(words)
    return [word for word, count in counts.most_common(top_n)]
