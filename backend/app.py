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
        # id_task=10,
        name='Spotkanie testowe',
        start=datetime(2025, 3, 21, 10, 0),  # Zadanie na 23 marca 2025
        end=datetime(2025, 3, 21, 12, 0),
        description='To jest testowe zadanie dodane na sztywno do bazy danych.',
        id_user=user.id_user,
        type=1
    )
    
    test_task_repeat = TaskRepeatWeekly(
        id_task=10,
        weekday = 4
    )
    
    db.session.add(test_task)
    # db.session.add(test_task_repeat)
    db.session.commit()
    print(f"Dodano zadanie: {test_task.name}")
#----------------------------------------------------------------


@app.route('/api/tasks/<int:year>/<int:month>', methods=['GET'])
def get_tasks(year, month):
    current_date = datetime.now()
    first_day = datetime(year, month, 1)
    if month == 12:
        last_day = datetime(year + 1, 1, 1) - timedelta(days=1)
    else:
        last_day = datetime(year, month + 1, 1) - timedelta(days=1)
    
    # Pobierz wszystkie zadania z danego miesiąca
    tasks = Task.query.filter(
        ((Task.start >= first_day) & (Task.start <= last_day)) |
        ((Task.end >= first_day) & (Task.end <= last_day))
    ).all()
    
    # Pobierz wszystkie zadania powtarzające się (typ 1 i 2)
    recurring_tasks = Task.query.filter(Task.type.in_([1, 2])).all()
    
    tasks_json = []
    
    # Dodaj zwykłe zadania (typ 0)
    for task in tasks:
        if task.type == 0:  # Jednorazowe zadanie
            tasks_json.append({
                'id': task.id_task,
                'name': task.name,
                'start': task.start.strftime('%Y-%m-%d %H:%M:%S'),
                'end': task.end.strftime('%Y-%m-%d %H:%M:%S') if task.end else None,
                'description': task.description,
                'type': task.type,
                'day': task.start.day
            })
    
    # Dodaj zadania powtarzające się tygodniowo (typ 1)
    for task in recurring_tasks:
        if task.type == 1:  # Zadanie powtarzające się tygodniowo
            weekly_repeats = TaskRepeatWeekly.query.filter_by(id_task=task.id_task).all()
            
            for repeat in weekly_repeats:
                current_date_iter = first_day
                while current_date_iter <= last_day:
                    # Dodaj sprawdzenie czy data jest większa lub równa aktualnej dacie
                    if current_date_iter.weekday() == repeat.weekday and current_date_iter >= current_date:
                        tasks_json.append({
                            'id': task.id_task,
                            'name': task.name,
                            'start': task.start.strftime('%Y-%m-%d %H:%M:%S'),
                            'end': task.end.strftime('%Y-%m-%d %H:%M:%S') if task.end else None,
                            'description': task.description,
                            'type': task.type,
                            'day': current_date_iter.day,
                            'weekday': repeat.weekday
                        })
                    current_date_iter += timedelta(days=1)
    
    # Podobnie dla zadań powtarzających się miesięcznie
        elif task.type == 2:  # Zadanie powtarzające się miesięcznie
            monthly_repeats = TaskRepeatMonthly.query.filter_by(id_task=task.id_task).all()
            for repeat in monthly_repeats:
                # Jeśli określony jest konkretny dzień miesiąca
                if repeat.day_of_month:
                    last_day_of_month = last_day.day
                    if repeat.day_of_month <= last_day_of_month:
                        # Utwórz datę dla tego dnia miesiąca
                        task_date = datetime(year, month, repeat.day_of_month)
                        # Sprawdź czy data jest większa lub równa aktualnej dacie
                        if task_date >= current_date:
                            tasks_json.append({
                                'id': task.id_task,
                                'name': task.name,
                                'start': task.start.strftime('%Y-%m-%d %H:%M:%S'),
                                'end': task.end.strftime('%Y-%m-%d %H:%M:%S') if task.end else None,
                                'description': task.description,
                                'type': task.type,
                                'day': repeat.day_of_month,
                                'day_of_month': repeat.day_of_month
                            })

                # Jeśli określony jest tydzień miesiąca i dzień tygodnia
                elif repeat.week_of_month and repeat.weekday is not None:
    # Znajdź pierwszy dzień miesiąca o danym dniu tygodnia
                    first_occurrence = first_day
                    while first_occurrence.weekday() != repeat.weekday:
                        first_occurrence += timedelta(days=1)

                    # Oblicz datę dla n-tego wystąpienia tego dnia tygodnia
                    target_date = first_occurrence + timedelta(weeks=(repeat.week_of_month - 1))

                    # Sprawdź czy data mieści się w miesiącu
                    if target_date.month == month and target_date >= current_date:
                        tasks_json.append({
                            'id': task.id_task,
                            'name': task.name,
                            'start': task.start.strftime('%Y-%m-%d %H:%M:%S'),
                            'end': task.end.strftime('%Y-%m-%d %H:%M:%S') if task.end else None,
                            'description': task.description,
                            'type': task.type,
                            'day': target_date.day,
                            'week_of_month': repeat.week_of_month,
                            'weekday': repeat.weekday
                        })
                        current_date += timedelta(days=1)
    
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