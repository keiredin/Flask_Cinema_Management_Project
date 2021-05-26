
from flask import render_template, url_for, flash, redirect,request
from Cinema_Management import app,db,bcrypt
from flask_login import login_user, logout_user, current_user, login_required
from Cinema_Management.model import Client
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
    # if current_user.is_authenticated:
    #     return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        username = "name"
        email = request.form['userEmail']
        password = request.form['userPassword']
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = Client(username=username, email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    # if current_user.is_authenticated:
    #     return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = Client.query.filter_by(email=request.form['userEmail']).first()
        if user and bcrypt.check_password_hash(user.password, request.form['userPassword']):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form)


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
