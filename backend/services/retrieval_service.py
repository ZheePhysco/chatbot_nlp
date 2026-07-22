from models.chunk_model import MateriChunk
from services.nlp_service import similarity

def retrieve_chunks(
    materi_id,
    pertanyaan,
    top_chunk=5,
    top_sentence=5
):
    semua_chunk = MateriChunk.query.filter_by(
        materi_id=materi_id
    ).all()

    hasil_chunk = []

    # Ranking Chunk
    for chunk in semua_chunk:
        score = similarity(
            chunk.chunk_text,
            pertanyaan
        )
        hasil_chunk.append({
            "text": chunk.chunk_text,
            "score": score
        })

    hasil_chunk.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    hasil_chunk = hasil_chunk[:top_chunk]

    # Ranking Sentence
    hasil_sentence = []
    for item in hasil_chunk:
        kalimat = item["text"].split(".")
        for sentence in kalimat:
            sentence = sentence.strip()
            if len(sentence) < 10:
                continue
            score = similarity(
                sentence,
                pertanyaan
            )
            hasil_sentence.append({
                "text": sentence,
                "score": score
            })

    hasil_sentence.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return hasil_sentence[:top_sentence]