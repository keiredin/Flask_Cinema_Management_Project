from flask import render_template, url_for, flash, redirect,request
from Cinema_Management import app,db,bcrypt
from flask_login import login_user, logout_user, current_user, login_required
from Cinema_Management.forms import LoginForm, RegistrationForm

from werkzeug.security import check_password_hash, generate_password_hash

@app.route("/")
@app.route("/index")
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')



@app.route("/register", methods=['GET', 'POST'])
def register():
    return render_template('register.html', title='Register',)


@app.route("/login", methods=['GET', 'POST'])
def login():
    return render_template('login.html', title='Login')


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route("/account")

def account():
    return render_template('account.html', title='Account')

@app.route("/cinema")

def cinema():
    return render_template('cinema.html', title='Cinema')


@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'),404


if __name__ == '__main__':
    app.run(debug=True)
