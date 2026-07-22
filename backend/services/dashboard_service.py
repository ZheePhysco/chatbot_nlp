from datetime import date
from models.materi_model import Materi
from models.chat_model import ChatHistory
from models.user_model import User

def get_total_materi():
    return Materi.query.count()

def get_total_chat():
    return ChatHistory.query.count()

def get_total_siswa():
    return User.query.filter_by(
        role="siswa"
    ).count()

def get_upload_today():
    return Materi.query.filter(
        Materi.created_at >= date.today()
    ).count()

def get_recent_upload(limit=5):
    data = Materi.query.order_by(
        Materi.created_at.desc()
    ).limit(limit).all()

    hasil = []
    for item in data:
        hasil.append({
            "judul": item.nama_file,
            "tanggal": item.created_at.strftime("%d-%m-%Y")
        })

    return hasil

def get_recent_materi(limit=5):
    data = Materi.query.order_by(
        Materi.created_at.desc()
    ).limit(limit).all()

    hasil = []
    for item in data:
        hasil.append({
            "judul": item.judul
        })

    return hasil