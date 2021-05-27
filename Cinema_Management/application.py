
from flask import render_template, url_for, flash, redirect,request
from flask_login.utils import confirm_login
from Cinema_Management import app,db,bcrypt
from flask_login import login_user, logout_user, current_user, login_required
from Cinema_Management.model import Client, Comment, Movie
from Cinema_Management.forms import LoginForm, RegistrationForm
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from werkzeug.security import check_password_hash, generate_password_hash

admin = Admin(app)
admin.add_view(ModelView(Client, db.session))
admin.add_view(ModelView(Movie, db.session))
admin.add_view(ModelView(Comment, db.session))

@app.route("/")
@app.route("/index")
def index():
    movies = Movie.query.all()
    return render_template("index.html", movies=movies)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')



@app.route("/login", methods=['GET', 'POST'])
def login():
    # if current_user.is_authenticated:
    #     return redirect(url_for('home'))
    form = RegistrationForm()
    # if form.validate_on_submit():
    
    if request.method == 'POST':   
        if request.form.get("signup"):
            error = ""
            username = request.form.get("userName")
            email = request.form.get("userEmail")
            password = request.form.get("userPassword") 
            confPassword = request.form.get("userCP")
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            if((username is None) or (password is None) or (email is None) or (confPassword is None)):
                error = "Something is missing!"
            elif(Client.query.filter_by(email=email).first() is not None):
                error = "Email is already taken!"
            
            if error == "":
                user = Client(username=username, email=email, password=password)
                db.session.add(user)
                db.session.commit()
                return redirect(url_for('login'))
            flash(error, 'danger')
            return render_template('login.html')
        if request.form.get("login"):
            user = Client.query.filter_by(email=request.form['userEmailLog']).first()
            if user: #and bcrypt.check_password_hash(user.password, request.form['userPassword'])
                return redirect(url_for('index'))
                # login_user(user, remember=form.remember.data)
                # next_page = request.args.get('next')
                # return redirect(next_page) if next_page else redirect(url_for('home'))
            else:
                flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html')
    
@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route("/account")
def account():
    return render_template('account.html', title='Account')

@app.route("/cinema/<int:id>")
def cinema(id):
    movie = Movie.query.filter_by(id=id).first()
    return render_template('cinema.html', title=movie.title, movie=movie)

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'),404

@app.route('/movies', methods=['GET', 'POST'])
def movies():
    Movies = Movie.query.all()
    if request.method == 'POST':
        search = request.form.get('search')
        if search:
            movieSearch = Movie.query.filter(Movie.title.ilike(r"%{}%".format(search))).all()
            return render_template('movies.html', movieSearch=movieSearch)
        else:
            flash('Type some title!', 'danger')
    return render_template('movies.html', movies=Movies)
if __name__ == '__main__':
    app.run(debug=True)
