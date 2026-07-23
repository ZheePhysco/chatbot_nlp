from flask import Blueprint, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from models.chat_model import ChatHistory
from models.materi_model import Materi
from models.user_model import User
from database import db
from sqlalchemy import func

history_bp = Blueprint(
    "history",
    __name__
)


@history_bp.route(
    "/my",
    methods=["GET"]
)
@jwt_required()
def my_history():
    try:
        user_id = int(get_jwt_identity())
        data = ChatHistory.query.filter_by(
            user_id=user_id
        ).order_by(
            ChatHistory.created_at.desc()
        ).all()

        hasil = []
        for item in data:
            materi = Materi.query.get(
                item.materi_id
            )
            hasil.append({
                "id": item.id,
                "pertanyaan": item.pertanyaan,
                "jawaban": item.jawaban,
                "similarity_score": item.similarity_score,
                "status": item.status,
                "materi": materi.judul if materi else "-",
                "created_at": item.created_at.strftime(
                    "%d-%m-%Y %H:%M"
                )
            })

        return jsonify(hasil), 200

    except Exception as e:
        return jsonify({
            "message": str(e)
        }), 500


@history_bp.route(
    "/all",
    methods=["GET"]
)
@jwt_required()
def all_history():
    try:
        data = ChatHistory.query.order_by(
            ChatHistory.created_at.desc()
        ).all()

        hasil = []
        for item in data:
            materi = Materi.query.get(item.materi_id)
            user = User.query.get(item.user_id)
            hasil.append({
                "id": item.id,
                "pertanyaan": item.pertanyaan,
                "jawaban": item.jawaban,
                "similarity_score": item.similarity_score,
                "status": item.status,
                "materi": materi.judul if materi else "-",
                "user": user.nama if user else "-",
                "created_at": item.created_at.strftime(
                    "%d-%m-%Y %H:%M"
                )
            })

        return jsonify(hasil), 200

    except Exception as e:
        return jsonify({
            "message": str(e)
        }), 500


@history_bp.route(
    "/analisis",
    methods=["GET"]
)
@jwt_required()
def analisis_chat():
    try:
     
        total = ChatHistory.query.count()


        relevan = ChatHistory.query.filter(
            ChatHistory.status != "Tidak Relevan"
        ).count()

        tidak_relevan = ChatHistory.query.filter_by(
            status="Tidak Relevan"
        ).count()

      
        per_materi = db.session.query(
            Materi.judul,
            func.count(ChatHistory.id).label("jumlah")
        ).join(
            ChatHistory,
            Materi.id == ChatHistory.materi_id
        ).group_by(
            Materi.id
        ).order_by(
            func.count(ChatHistory.id).desc()
        ).limit(5).all()

      
        terbaru = ChatHistory.query.order_by(
            ChatHistory.created_at.desc()
        ).limit(5).all()

        pertanyaan_terbaru = []
        for item in terbaru:
            pertanyaan_terbaru.append({
                "pertanyaan": item.pertanyaan,
                "status": item.status,
                "created_at": item.created_at.strftime(
                    "%d-%m-%Y %H:%M"
                )
            })

        return jsonify({
            "total_chat": total,
            "total_relevan": relevan,
            "total_tidak_relevan": tidak_relevan,
            "per_materi": [
                {
                    "materi": row[0],
                    "jumlah": row[1]
                }
                for row in per_materi
            ],
            "pertanyaan_terbaru": pertanyaan_terbaru
        }), 200

    except Exception as e:
        return jsonify({
            "message": str(e)
        }), 500