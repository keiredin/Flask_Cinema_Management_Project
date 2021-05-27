from datetime import datetime
from enum import unique
from Cinema_Management import db,bcrypt #login_manager,
from flask_login import UserMixin


class Client(db.Model):
    __tablename__ = "client"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(30), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(100), default='user.png')

    def __repr__(self):
        return f"Client('{self.username}', '{self.email}', '{self.image}')"

class Movie(db.Model):
    __tablename__ = "movies"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String())
    postor = db.Column(db.String(), default='movie.png', nullable=False)
    background = db.Column(db.String(), nullable=False, default='background.jpg')
    trailer = db.Column(db.String())
    screening = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    genre = db.Column(db.String(), nullable=False)
    idmbRating = db.Column(db.Float, nullable=False, default=0.0)
    airedBy = db.Column(db.String(), nullable=False)
    release = db.Column(db.DateTime, nullable=False)
    ticket = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return f"Movie('{self.title}')"