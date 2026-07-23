from database import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    email = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )
    password = db.Column(
        db.String(255),
        nullable=False
    )
    role = db.Column(
        db.Enum("guru","siswa"),
        nullable=False
    )
    foto = db.Column(
        db.String(255),
        nullable=True
    )
    bio = db.Column(
        db.Text,
        nullable=True
    )
    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )