from database import db

class MateriChunk(db.Model):

    __tablename__ = "materi_chunks"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    materi_id = db.Column(
        db.Integer,
        db.ForeignKey("materi.id")
    )

    chunk_index = db.Column(
        db.Integer
    )

    heading = db.Column(
        db.String(255),
        nullable=True
    )

    chunk_text = db.Column(
        db.Text
    )

    sentence_count = db.Column(
        db.Integer,
        default=0
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )