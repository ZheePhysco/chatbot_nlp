import os
from flask import Blueprint
from flask import request
from flask_jwt_extended import (
    get_jwt_identity
)
from database import db
from models.materi_model import Materi
from utils.role_middleware import (
    guru_required
)
from services.file_service import (
    read_pdf,
    read_docx,
    read_txt
)
from models.chunk_model import (
    MateriChunk
)
from services.chunk_service import (
    split_into_chunks
)

materi_bp = Blueprint(
    "materi",
    __name__
)

# UPLOAD MATERI
@materi_bp.route(
    "/upload",
    methods=["POST"]
)
@guru_required
def upload_materi():
    print("CONTENT TYPE :", request.content_type)
    print("FORM :", request.form)
    print("FILES :", request.files)
    print("HEADERS :", request.headers)

    file = request.files.get("file")
    judul = request.form.get("judul")

    if not file:
        return {
            "message": "File wajib diupload"
        }, 400

    filename = file.filename
    upload_folder = "uploads"
    os.makedirs(
        upload_folder,
        exist_ok=True
    )
    filepath = os.path.join(
        upload_folder,
        filename
    )
    file.save(filepath)

    isi_materi = ""

    if filename.endswith(".pdf"):
        isi_materi = read_pdf(filepath)
    elif filename.endswith(".docx"):
        isi_materi = read_docx(filepath)
    elif filename.endswith(".txt"):
        isi_materi = read_txt(filepath)
    else:
        return {
            "message": "Format tidak didukung"
        }, 400

    user_id = get_jwt_identity()
    materi = Materi(
        user_id=int(user_id),
        judul=judul,
        nama_file=filename,
        isi_materi=isi_materi
    )

    db.session.add(materi)
    db.session.commit()

    chunks = split_into_chunks(isi_materi)

    for item in chunks:
        chunk = MateriChunk(
            materi_id=materi.id,
            chunk_index=item["index"],
            chunk_text=item["text"],
            sentence_count=item["text"].count(".") + 1
        )
        db.session.add(chunk)

    db.session.commit()

    return {
        "message": "Materi berhasil diupload",
        "judul": judul,
        "jumlah_karakter": len(isi_materi),
        "jumlah_chunk": len(chunks)
    }

# GET SEMUA MATERI
@materi_bp.route(
    "",
    methods=["GET"]
)
def get_materi():
    try:
        daftar = Materi.query.order_by(
            Materi.id.desc()
        ).all()

        hasil = []
        for item in daftar:
            hasil.append({
                "id": item.id,
                "judul": item.judul,
                "nama_file": item.nama_file
            })

        return hasil, 200

    except Exception as e:
        return {
            "message": str(e)
        }, 500

# GET DETAIL MATERI
@materi_bp.route(
    "/<int:id>",
    methods=["GET"]
)
def get_detail_materi(id):
    try:
        materi = Materi.query.get(id)

        if not materi:
            return {
                "message": "Materi tidak ditemukan"
            }, 404

        return {
            "id": materi.id,
            "judul": materi.judul,
            "nama_file": materi.nama_file,
            "isi_materi": materi.isi_materi
        }, 200

    except Exception as e:
        return {
            "message": str(e)
        }, 500