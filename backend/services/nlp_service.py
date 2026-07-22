import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from Sastrawi.Stemmer.StemmerFactory import (
    StemmerFactory
)
from sklearn.feature_extraction.text import (
    TfidfVectorizer
)
from sklearn.metrics.pairwise import (
    cosine_similarity
)
from models.chunk_model import (
    MateriChunk
)

stop_words = set(
    stopwords.words(
        "indonesian"
    )
)

stemmer = (
    StemmerFactory()
    .create_stemmer()
)

# preprocessing
def preprocess(text):
    text = text.lower()
    text = re.sub(
        r"[^a-zA-Z0-9\s]",
        " ",
        text
    )
    tokens = word_tokenize(
        text
    )
    tokens = [
        stemmer.stem(word)
        for word in tokens
        if word not in stop_words
    ]
    return " ".join(tokens)

# similarity
def similarity(
    chunk,
    pertanyaan
):
    chunk = preprocess(chunk)
    pertanyaan = preprocess(
        pertanyaan
    )

    docs = [
        chunk,
        pertanyaan
    ]

    tfidf = TfidfVectorizer()
    matrix = tfidf.fit_transform(
        docs
    )

    score = cosine_similarity(
        matrix[0:1],
        matrix[1:2]
    )

    return float(
        score[0][0]
    )

# mencari chunk
from services.chunk_service import (
    split_into_chunks
)

def find_best_chunk(
    materi,
    pertanyaan
):
    chunks = split_into_chunks(
        materi
    )

    best_score = 0
    best_chunk = ""

    for chunk in chunks:
        score = similarity(
            chunk,
            pertanyaan
        )

        if score > best_score:
            best_score = score
            best_chunk = chunk

    return best_chunk, best_score

# mencari best chunk
def search_best_chunks(
    materi_id,
    pertanyaan,
    top_k=5
):
    chunks = MateriChunk.query.filter_by(
        materi_id=materi_id
    ).all()

    hasil = []

    for item in chunks:
        score = similarity(
            item.chunk_text,
            pertanyaan
        )

        hasil.append({
            "chunk": item.chunk_text,
            "score": score
        })

    hasil = sorted(
        hasil,
        key=lambda x: x["score"],
        reverse=True
    )

    return hasil[:top_k]