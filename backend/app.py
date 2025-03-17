from flask import Flask, request, render_template, jsonify
from flask_assets import Environment, Bundle
from models import db, User, Task, TaskRepeatWeekly, TaskRepeatMonthly
import os

app = Flask(__name__, template_folder = '../frontend')

assets = Environment(app)
app.static_folder = '../frontend/static'
assets.url = app.static_url_path
sass = Bundle('sass/global.sass','sass/month.sass', 'sass/nav_bar.sass', filters=['libsass'], output='all.css')
assets.register('sass_all', sass)

#Database initialization
# basedir = os.path.abspath(os.path.dirname(__file__))
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, os.pardir, 'db', 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


@app.route('/', methods=['GET',"POST"])
def home():
    return app.redirect('/miesiac')
    
@app.route('/miesiac', methods=['GET',"POST"])
def month():
    if request.method == 'GET':
        test = ['test1', 'test2', 'test3']
        return render_template('month.html', test=test)
    
@app.route('/tydzien', methods=['GET',"POST"])
def week():
    if request.method == 'GET':
        test = ['test1', 'test2', 'test3']
        return render_template('week.html', test=test)
    
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug = True)