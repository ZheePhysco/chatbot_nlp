from database import db

class ChatHistory(db.Model):

    __tablename__ = "chat_history"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )

    materi_id = db.Column(
        db.Integer,
        db.ForeignKey("materi.id")
    )

    pertanyaan = db.Column(
        db.Text
    )

    jawaban = db.Column(
        db.Text
    )

    similarity_score = db.Column(
        db.Float
    )

    status = db.Column(
        db.String(30)
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )