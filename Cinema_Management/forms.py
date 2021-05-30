from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from Cinema_Management.model import Client



class RegistrationForm(FlaskForm):
    username = StringField('Username',
                           validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password',
                                     validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

    def validate_username(self, username):
        user = Client.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('That username is taken. Please choose a different one.')

    

    def validate_email(self, email):
        user = Client.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('That email is taken. Please choose a different one.')
    


class LoginForm(FlaskForm):
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')


class ChangeEmailForm(FlaskForm):
    
    new_email = StringField('New Email',
                        validators=[DataRequired(), Email()])
    submit = SubmitField('Change Email')


    def validate_email(self, new_email):
        user = Client.query.filter_by(email=new_email.data).first()
        if user:
            raise ValidationError('That email is already exist!')

class ChangePasswordForm(FlaskForm):
    
    new_password = PasswordField('New Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password',
                                     validators=[DataRequired(), EqualTo('new_password')])
    submit = SubmitField('Change Password')

class SocialLinkForm(FlaskForm):
    twitter = StringField('Twitter',
                           validators=[DataRequired(), Length(min=15, max=40)])
    instagram = StringField('Instagram',
                           validators=[DataRequired(), Length(min=15, max=40)])
    # facebook = StringField('Facebook',
    #                        validators=[DataRequired(), Length(min=15, max=40)])