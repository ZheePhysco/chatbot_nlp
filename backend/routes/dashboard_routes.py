from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from services.dashboard_service import (
    get_total_materi,
    get_total_chat,
    get_total_siswa,
    get_upload_today,
    get_recent_upload,
    get_recent_materi
)

dashboard_bp = Blueprint(
    "dashboard",
    __name__
)

@dashboard_bp.route("/guru", methods=["GET"])
@jwt_required()
def dashboard_guru():
    return jsonify({
        "jumlah_materi": get_total_materi(),
        "jumlah_chat": get_total_chat(),
        "jumlah_siswa": get_total_siswa(),
        "upload_hari_ini": get_upload_today(),
        "aktivitas": get_recent_upload(),
        "materi_terbaru": get_recent_materi()
    })