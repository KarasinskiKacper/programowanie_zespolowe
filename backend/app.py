from flask import Flask, request, render_template, jsonify
from flask_assets import Environment, Bundle
from datetime import datetime, timedelta

from models import db, User, Task, TaskRepeatWeekly, TaskRepeatMonthly
from sqlalchemy import exists
import os

from create_calendar import create_calendar

app = Flask(__name__, template_folder = '../frontend')

assets = Environment(app)
app.static_folder = '../frontend/static'
assets.url = app.static_url_path
sass = Bundle('sass/global.sass','sass/month.sass', 'sass/nav_bar.sass', 'sass/small_calendar.sass', 'sass/week.sass',  filters=['libsass'], output='all.css')
assets.register('sass_all', sass)

# Inicjalizacja bazy danych
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, os.pardir, 'db', 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

#----------------------------------------------------------------
def user_exists(email):
    return db.session.query(exists().where(User.email == email)).scalar()

# Funkcja dodająca testowego użytkownika
def add_test_user():
    # Sprawdź czy użytkownik już istnieje
    if not user_exists('test@example.com'):
        test_user = User(
            nickname='testuser',
            email='test@example.com',
            password='haslo123',
            phone_number=123456789
        )
        db.session.add(test_user)
        db.session.commit()
        print(f"Dodano użytkownika: {test_user.nickname}")
    else:
        print("Użytkownik już istnieje")

# Funkcja dodająca testowe zadanie
def add_test_task():
    # Sprawdź czy użytkownik istnieje
    if not db.session.query(User).filter_by(email='test@example.com').first():
        add_test_user()
    
    # Pobierz ID użytkownika
    user = db.session.query(User).filter_by(email='test@example.com').first()
    
    # Dodaj zadanie
    test_task = Task(
        name='Spotkanie testowe',
        start=datetime(2025, 4, 25, 10, 0),  # Zadanie na 23 marca 2025
        end=datetime(2025, 4, 26, 12, 0),
        description='To jest testowe zadanie dodane na sztywno do bazy danych.',
        id_user=user.id_user,
        type=1
    )
    
    db.session.add(test_task)
    db.session.commit()
    print(f"Dodano zadanie: {test_task.name}")
#----------------------------------------------------------------


@app.route('/api/tasks/<int:year>/<int:month>', methods=['GET'])
def get_tasks(year, month):
    first_day = datetime(year, month, 1)
    if month == 12:
        last_day = datetime(year + 1, 1, 1) - timedelta(days=1)
    else:
        last_day = datetime(year, month + 1, 1) - timedelta(days=1)
    tasks = Task.query.filter(
        ((Task.start >= first_day) & (Task.start <= last_day)) | 
        ((Task.end >= first_day) & (Task.end <= last_day))
    ).all()
    tasks_json = []
    for task in tasks:
        tasks_json.append({
            'id': task.id_task,
            'name': task.name,
            'start': task.start.strftime('%Y-%m-%d %H:%M:%S'),
            'end': task.end.strftime('%Y-%m-%d %H:%M:%S') if task.end else None,
            'description': task.description,
            'type': task.type,
            'day': task.start.day
        })
    return jsonify(tasks_json)

@app.route('/', methods=['GET',"POST"])
def home():
    return app.redirect('/miesiac')
    
@app.route('/miesiac', methods=['GET',"POST"])
def month():
    if request.method == 'GET':
        date = datetime.now()
        
        return render_template('month.html', date = date, create_calendar=create_calendar, offset = 0)
    
@app.route('/tydzien', methods=['GET',"POST"])
def week():
    if request.method == 'GET':
        test = ['test1', 'test2', 'test3']
        return render_template('week.html', test=test)
    
with app.app_context():
    db.create_all()
# odkomentuj aby dodać testowego użytkownika lub zadanie
    # add_test_user()
    # add_test_task()
    
if __name__ == '__main__':
    app.run(debug = True)