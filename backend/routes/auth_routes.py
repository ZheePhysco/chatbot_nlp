from flask import Blueprint
from flask import request
from flask import jsonify
from database import db
from models.user_model import User
import bcrypt
from flask_jwt_extended import create_access_token

# Blueprint
auth_bp = Blueprint(
    "auth",
    __name__
)

# =====================================
# REGISTER
# =====================================
@auth_bp.route(
    "/register",
    methods=["POST"]
)
def register():
    try:
        data = request.get_json()
        nama = data.get("nama")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        # ==========================
        # Validasi Field
        # ==========================
        if not nama or not email or not password or not role:
            return jsonify({
                "message": "Semua field wajib diisi"
            }), 400

        # ==========================
        # Validasi Role
        # ==========================
        if role not in ["guru", "siswa"]:
            return jsonify({
                "message": "Role harus guru atau siswa"
            }), 400

        # ==========================
        # Cek Email
        # ==========================
        user_exist = User.query.filter_by(
            email=email
        ).first()

        if user_exist:
            return jsonify({
                "message": "Email sudah digunakan"
            }), 400

        # ==========================
        # Hash Password
        # ==========================
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

        # ==========================
        # Simpan User
        # ==========================
        user = User(
            nama=nama,
            email=email,
            password=hashed_password.decode("utf-8"),
            role=role
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({
            "message": "Registrasi berhasil"
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": str(e)
        }), 500

# =====================================
# LOGIN
# =====================================
@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # ==========================
        # Validasi Field
        # ==========================
        if not email or not password:
            return jsonify({
                "message": "Email dan password wajib diisi"
            }), 400

        # ==========================
        # Cari User
        # ==========================
        user = User.query.filter_by(
            email=email
        ).first()

        if not user:
            return jsonify({
                "message": "User tidak ditemukan"
            }), 404

        # ==========================
        # Cek Password
        # ==========================
        valid_password = bcrypt.checkpw(
            password.encode("utf-8"),
            user.password.encode("utf-8")
        )

        if not valid_password:
            return jsonify({
                "message": "Password salah"
            }), 401

        # ==========================
        # Generate JWT Token
        # ==========================
        token = create_access_token(
            identity=str(user.id)
        )

        # ==========================
        # Response Login
        # ==========================
        return jsonify({
            "message": "Login berhasil",
            "token": token,
            "id": user.id,
            "nama": user.nama,
            "email": user.email,
            "role": user.role
        }), 200

    except Exception as e:
        return jsonify({
            "message": str(e)
        }), 500