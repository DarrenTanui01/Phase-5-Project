from flask import Flask
from extensions import db, jwt
from routes import api_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    jwt.init_app(app)
    app.register_blueprint(api_bp, url_prefix='/api')

    with app.app_context():
        db.create_all()

    return app