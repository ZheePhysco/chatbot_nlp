from database import db

class Materi(db.Model):
    __tablename__ = "materi"

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )
    judul = db.Column(
        db.String(200)
    )
    nama_file = db.Column(
        db.String(255)
    )
    isi_materi = db.Column(
        db.Text
    )
    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )