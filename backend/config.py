import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///bizpro.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')