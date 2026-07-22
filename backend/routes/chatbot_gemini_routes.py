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
from services.gemini_service import ask_gemini

chatbot_gemini_bp = Blueprint(
    "chatbot_gemini",
    __name__
)

@chatbot_gemini_bp.route(
    "/gemini",
    methods=["POST"]
)
@jwt_required()
def ask_gemini_chat():
    try:
        data = request.get_json()
        materi_id = data.get("materi_id")
        pertanyaan = data.get("pertanyaan")

        if not materi_id:
            return jsonify({
                "message": "Materi harus dipilih."
            }), 400

        if not pertanyaan:
            return jsonify({
                "message": "Pertanyaan tidak boleh kosong."
            }), 400

        materi = Materi.query.get(
            materi_id
        )

        if materi is None:
            return jsonify({
                "message": "Materi tidak ditemukan."
            }), 404

        context = materi.isi_materi

        jawaban = ask_gemini(
            context,
            pertanyaan
        )

        chat = ChatHistory(
            user_id=int(
                get_jwt_identity()
            ),
            materi_id=materi_id,
            pertanyaan=pertanyaan,
            jawaban=jawaban,
            similarity_score=1.0,
            status="Gemini AI"
        )

        db.session.add(chat)
        db.session.commit()

        return jsonify({
            "jawaban": jawaban,
            "status": "Gemini AI",
            "materi": materi.judul
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": str(e)
        }), 500