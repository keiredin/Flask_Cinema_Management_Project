from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView





#heroku pg:psql -a books-review-heroku



app = Flask(__name__)
app.config['SECRET_KEY'] = 'cd796a2901826d78fc4c99eb7c7ba64ccdcaee8973cda1df9c302cf9d72ba892'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://kera:test@localhost:5432/test'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://qefdavrpzwomaz:494834af64366e41716b9e0b1ceedbeeb25cb1f2eedf5f0e5c0a18cc02983223@ec2-3-233-7-12.compute-1.amazonaws.com:5432/dajv8bbru9n8v7'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'


from Cinema_Management.model import Client , Movie , Comment

admin = Admin(app)
admin.add_view(ModelView(Client, db.session))
admin.add_view(ModelView(Movie, db.session))
admin.add_view(ModelView(Comment, db.session))



from Cinema_Management import application

