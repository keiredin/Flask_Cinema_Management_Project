
from flask import render_template, url_for, flash, redirect,request
from flask_login.utils import confirm_login
from flask_wtf import form
from Cinema_Management import app,db,bcrypt,login_manager,admin
from flask_login import login_user, logout_user, current_user, login_required
from Cinema_Management.model import Client, Comment, Movie
from Cinema_Management.forms import LoginForm, RegistrationForm, ChangeEmailForm, ChangePasswordForm ,SocialLinkForm

@login_manager.user_loader
def load_user(id):
    return Client.query.get(int(id))


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
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    form= LoginForm()
    form2 = RegistrationForm()
 
    if request.method == 'POST':

        # signUp block   
        if form2.validate_on_submit():
            
            username = form2.username.data
            email = form2.email.data
            password = form2.password.data
            confPassword = form2.confirm_password.data
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            
            user = Client(username=username, email=email, password=hashed_password)
            db.session.add(user)
            db.session.commit()
            flash('Your account has been created! You are now able to log in', 'success')
            return redirect(url_for('login'))
            
        
        # login(signin) area
        if form.validate_on_submit():
            user = Client.query.filter_by(email=form.email.data).first()
            if user and bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)
                next_page = request.args.get('next')
                # return redirect(url_for('index'))
                return redirect(next_page) if next_page else redirect(url_for('index'))
            else:
                flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form, form2=form2)



@app.route("/account/" , methods=['GET','POST'])
def account():
    formE = ChangeEmailForm()
    formP = ChangePasswordForm()
    formS = SocialLinkForm()
    id = current_user.id;
    if request.method == 'POST':
        user = Client.query.get_or_404(id)
        if formE.validate_on_submit():
            current_email = user.email
            new_email = formE.new_email.data
            # if new_email == current_email:
            #     flash('New email cannot be the same as the old one', 'danger')
            #     return redirect(url_for('account'))
            # else:
            user.email=new_email
            try:
                db.session.commit()
                flash('Email changed successfully', 'success')
                return redirect(url_for('logout'))
            except:
                return "There was a problem on updating!"
        
        elif(formP.validate_on_submit()):
            
            new_password = formP.new_password.data
            hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
            user.password = hashed_password
            try:
                db.session.commit()
                flash('Password changed successfully', 'success')
                return redirect(url_for('account'))
            except:
                return "There was a problem on updating!"
        
        elif(formS.validate_on_submit()):
            
            twitter = formS.twitter.data
            instagram = formS.instagram.data
            user.twitter_link = twitter
            user.instagram_link = instagram
            try:
                db.session.commit()
                flash('Social media link added successfully', 'success')
                return redirect(url_for('index'))
            except:
                return "There was a problem on updating!"
        elif(request.form.get('subscribe')):
            checkbox_value = request.form.get('newsLetterCheckbox')
            # if checkbox_value:
            flash('Changes were successfull', 'success')
            return redirect(url_for('account'))
                
            # else:
            #     return "null"
        elif(request.form.get('deleteAcc')):
            try:
                db.session.delete(user)
                db.session.commit()
                flash('your account has been deleted!','success')
                return redirect(url_for('logout'))
            except:
                return "There was a problem on updating!"

        else:
            print(current_user.id)
            return "else"
            # return redirect(url_for('account'))

    return render_template('account.html', title='Account', formE=formE , formP=formP ,formS=formS)

@app.route("/cinema/<int:id>")
@login_required
def cinema(id):
    movie = Movie.query.filter_by(id=id).first()
    if request.method =='POST':
        user_comment = request.form.get('commentArea')
        current_user_comment = Comment(client_id=current_user.id,movie_id=id,comment=user_comment)
        db.session.add(current_user_comment)
        db.session.commit()
    comments = Comment.query.all()
    return render_template('cinema.html', title=movie.title, movie=movie, comments=comments)



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

    
@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'),404

if __name__ == '__main__':
    app.run(debug=True)
