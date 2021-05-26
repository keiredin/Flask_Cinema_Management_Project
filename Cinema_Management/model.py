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

# class Movie(db.Model):
#     __tablename__ = "movies"

#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(50), nullable=False)
