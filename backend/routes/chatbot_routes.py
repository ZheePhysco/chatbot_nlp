from flask import Blueprint
from flask import request
from flask import jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from database import db
from models.materi_model import Materi
from models.chat_model import ChatHistory
from services.retrieval_service import retrieve_chunks
from services.answer_service import build_answer

# Blueprint
chatbot_bp = Blueprint(
    "chatbot",
    __name__
)

# CHATBOT
@chatbot_bp.route(
    "/ask",
    methods=["POST"]
)
@jwt_required()
def ask():
    try:
        # Ambil Data Request
        data = request.get_json()
        materi_id = data.get("materi_id")
        pertanyaan = data.get("pertanyaan")

        # Validasi
        if not materi_id:
            return jsonify({
                "message": "Materi harus dipilih"
            }), 400

        if not pertanyaan:
            return jsonify({
                "message": "Pertanyaan tidak boleh kosong"
            }), 400

        # Cek Materi
        materi = Materi.query.get(materi_id)
        if materi is None:
            return jsonify({
                "message": "Materi tidak ditemukan"
            }), 404

        # Retrieval NLP v2
        hasil = retrieve_chunks(
            materi_id=materi_id,
            pertanyaan=pertanyaan,
            top_chunk=5,
            top_sentence=5
        )

        if len(hasil) == 0:
            return jsonify({
                "message": "Tidak ada chunk yang ditemukan."
            }), 404

        similarity = hasil[0]["score"]

        confidence = round(
            similarity * 100,
            2
        )

        if similarity >= 0.80:
            status = "Sangat Relevan"
        elif similarity >= 0.60:
            status = "Relevan"
        elif similarity >= 0.40:
            status = "Cukup Relevan"
        else:
            status = "Tidak Relevan"

        if similarity >= 0.40:
            jawaban = build_answer(
                pertanyaan,
                hasil
            )
        else:
            jawaban = (
                "Maaf, pertanyaan Anda "
                "tidak sesuai dengan "
                "materi yang tersedia."
            )

        # Simpan History
        chat = ChatHistory(
            user_id=int(
                get_jwt_identity()
            ),
            materi_id=materi_id,
            pertanyaan=pertanyaan,
            jawaban=jawaban,
            similarity_score=similarity,
            status=status
        )

        db.session.add(chat)
        db.session.commit()

        # Response
        return jsonify({
            "status": status,
            "similarity": round(
                similarity,
                4
            ),
            "confidence": confidence,
            "jawaban": jawaban,
            "materi": materi.judul,
            "referensi": [
                {
                    "score": round(
                        item["score"],
                        4
                    ),
                    "preview": item["text"][:200]
                }
                for item in hasil
            ]
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": str(e)
        }), 500