from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager




app = Flask(__name__)
app.config['SECRET_KEY'] = '1e07f0c34ef1be80ed88755ff7ceb9c2'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://kera:test@localhost:5432/test'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
# login_manager = LoginManager(app)
# login_manager.login_view = 'login'
# login_manager.login_message_category = 'info'


from Cinema_Management import application

