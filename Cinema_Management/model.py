from datetime import datetime
from enum import unique
from Cinema_Management import db,login_manager,bcrypt
from flask_login import UserMixin

class Client(db.Model):
    __table__name = "Clients"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(30), nullable=False, unique=True)
    password = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"Client('{self.username}', '{self.email}')"
