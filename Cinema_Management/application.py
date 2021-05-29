
from flask import render_template, url_for, flash, redirect,request
from flask_login.utils import confirm_login
from Cinema_Management import app,db,bcrypt,login_manager
from flask_login import login_user, logout_user, current_user, login_required
from Cinema_Management.model import Client, Comment, Movie
from Cinema_Management.forms import LoginForm, RegistrationForm
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView


admin = Admin(app)
admin.add_view(ModelView(Client, db.session))
admin.add_view(ModelView(Movie, db.session))
admin.add_view(ModelView(Comment, db.session))

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
    # form = RegistrationForm()
    if request.method == 'POST':

        # signUp block   
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
            
            else:
                user = Client(username=username, email=email, password=hashed_password)
                db.session.add(user)
                db.session.commit()
                flash('Your account has been created! You are now able to log in', 'success')
                return redirect(url_for('login'))
            flash(error, 'danger')
            return render_template('login.html')
        
        # login(signin) area
        if request.form.get("login"):
            user = Client.query.filter_by(email=request.form['userEmailLog']).first()
            if user and bcrypt.check_password_hash(user.password, request.form.get('userPasswordLog')):
                login_user(user)
                next_page = request.args.get('next')
                # return redirect(url_for('index'))
                return redirect(next_page) if next_page else redirect(url_for('index'))
            else:
                flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html')
    
@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route("/account/<int:id>" , methods=['GET','POST'])
def account(id):
    if request.method == 'POST':
        user = Client.query.get_or_404(id)
        if request.form.get("changeEmail"):
            current_email = user.email
            new_email = request.form.get('newEmail')
            if new_email == current_email:
                flash('New email cannot be the same as the old one', 'danger')
                return redirect(url_for('account',id=current_user.id))
            else:
                user.email=new_email
                try:
                    db.session.commit()
                    flash('Email changed successfully', 'success')
                    return redirect(url_for('logout'))
                except:
                    return "There was a problem on updating!"
        
        elif(request.form.get('changePassword')):
            
            new_password = request.form.get('newPassword')
            confirm_password = request.form.get('confirmPassword')
            if(new_password != confirm_password):
                flash('Password and confirm password do not match!', 'danger')
                return redirect(url_for('account',id=current_user.id))
            else:
                hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
                user.password=hashed_password
                try:
                    db.session.commit()
                    flash('Password changed successfully', 'success')
                    return redirect(url_for('account',id=current_user.id))
                except:
                    return "There was a problem on updating!"
        
        elif(request.form.get('changeSocialLinks')):
            
            twitter = request.form.get('twitter')
            instagram = request.form.get('instagram')
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
            return redirect(url_for('account',id=current_user.id))
                
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
            return "else"
            # return redirect(url_for('account',id=current_user.id))
    else:
        return render_template('account.html', title='Account')

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
