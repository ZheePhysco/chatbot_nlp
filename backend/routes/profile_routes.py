import os
import bcrypt
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from database import db
from models.user_model import User

profile_bp = Blueprint(
    "profile",
    __name__
)

UPLOAD_FOTO = "uploads/foto"

# =====================================
# GET PROFILE
# =====================================
@profile_bp.route(
    "/me",
    methods=["GET"]
)
@jwt_required()
def get_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                "message": "User tidak ditemukan"
            }), 404

        foto_url = None
        if user.foto:
            foto_url = f"http://127.0.0.1:5000/uploads/foto/{user.foto}"

        return jsonify({
            "id": user.id,
            "nama": user.nama,
            "email": user.email,
            "role": user.role,
            "bio": user.bio or "",
            "foto": foto_url
        }), 200

    except Exception as e:
        return jsonify({
            "message": str(e)
        }), 500

# =====================================
# UPDATE BIODATA
# =====================================
@profile_bp.route(
    "/update",
    methods=["PUT"]
)
@jwt_required()
def update_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                "message": "User tidak ditemukan"
            }), 404

        data = request.get_json()
        nama = data.get("nama")
        bio = data.get("bio")

        if nama:
            user.nama = nama
        if bio is not None:
            user.bio = bio

        db.session.commit()

        return jsonify({
            "message": "Profil berhasil diupdate",
            "nama": user.nama,
            "bio": user.bio
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": str(e)
        }), 500

# =====================================
# GANTI PASSWORD
# =====================================
@profile_bp.route(
    "/ganti-password",
    methods=["PUT"]
)
@jwt_required()
def ganti_password():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                "message": "User tidak ditemukan"
            }), 404

        data = request.get_json()
        password_lama = data.get("password_lama")
        password_baru = data.get("password_baru")

        if not password_lama or not password_baru:
            return jsonify({
                "message": "Password lama dan baru wajib diisi"
            }), 400

        valid = bcrypt.checkpw(
            password_lama.encode("utf-8"),
            user.password.encode("utf-8")
        )

        if not valid:
            return jsonify({
                "message": "Password lama salah"
            }), 401

        hashed = bcrypt.hashpw(
            password_baru.encode("utf-8"),
            bcrypt.gensalt()
        )
        user.password = hashed.decode("utf-8")
        db.session.commit()

        return jsonify({
            "message": "Password berhasil diubah"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": str(e)
        }), 500

# =====================================
# UPLOAD FOTO
# =====================================
@profile_bp.route(
    "/upload-foto",
    methods=["POST"]
)
@jwt_required()
def upload_foto():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                "message": "User tidak ditemukan"
            }), 404

        file = request.files.get("foto")

        if not file:
            return jsonify({
                "message": "File foto wajib diupload"
            }), 400

        ext = file.filename.rsplit(".", 1)[-1].lower()

        if ext not in ["jpg", "jpeg", "png", "webp"]:
            return jsonify({
                "message": "Format foto tidak didukung. Gunakan JPG, PNG, atau WEBP."
            }), 400

        os.makedirs(UPLOAD_FOTO, exist_ok=True)

        filename = f"user_{user_id}.{ext}"
        filepath = os.path.join(
            UPLOAD_FOTO,
            filename
        )
        file.save(filepath)

        user.foto = filename
        db.session.commit()

        return jsonify({
            "message": "Foto berhasil diupload",
            "foto": f"http://127.0.0.1:5000/uploads/foto/{filename}"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": str(e)
        }), 500