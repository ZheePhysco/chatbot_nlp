from functools import wraps
from flask_jwt_extended import (
    get_jwt_identity,
    verify_jwt_in_request
)
from models.user_model import User

def guru_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(
            int(user_id)
        )

        if not user:
            return {
                "message":"User tidak ditemukan"
            },404

        if user.role != "guru":
            return {
                "message":"Akses hanya untuk guru"
            },403

        return func(*args, **kwargs)
    return wrapper