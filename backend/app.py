from flask import Flask
from flask import send_from_directory
from config import Config
from database import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.materi_routes import materi_bp
from routes.chatbot_routes import chatbot_bp
from routes.chatbot_gemini_routes import chatbot_gemini_bp
from routes.dashboard_routes import dashboard_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)

jwt = JWTManager(app)

# BLUEPRINT
app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)

app.register_blueprint(
    dashboard_bp,
    url_prefix="/api/dashboard"
)

app.register_blueprint(
    materi_bp,
    url_prefix="/api/materi"
)

app.register_blueprint(
    chatbot_bp,
    url_prefix="/api/chat"
)

app.register_blueprint(
    chatbot_gemini_bp,
    url_prefix="/api/chat"
)

# HOME
@app.route("/")
def home():
    return {
        "message": "AILA Chatbot API"
    }

# FILE PREVIEW
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(
        "uploads",
        filename
    )

# MAIN
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(
        debug=True
    )