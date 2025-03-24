from flask import Flask, request, render_template, jsonify
from flask_assets import Environment, Bundle
from datetime import datetime, timedelta
from sqlalchemy import exists
from calendar import monthrange

from models import db, User, Task, Weekly, Monthly, Yearly
import os
import mimetypes
mimetypes.init()

from create_calendar import create_calendar

app = Flask(__name__, template_folder = '../frontend')

assets = Environment(app)
app.static_folder = '../frontend/static'
assets.url = app.static_url_path
sass = Bundle('sass/global.sass','sass/month.sass', 'sass/nav_bar.sass', 'sass/small_calendar.sass', 'sass/week.sass',  filters=['libsass'], output='all.css')
assets.register('sass_all', sass)

# Database initialization
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
# ----------------------------------------------------------------


@app.route('/tasks', methods=['GET'])
def get_tasks_week():
    # Pobranie i sparsowanie dat z query params
    start_date = datetime.fromisoformat(request.args.get('start_date'))
    end_date = datetime.fromisoformat(request.args.get('end_date'))

    # Zadania jednorazowe w przedziale
    tasks = Task.query.filter(Task.start >= start_date, Task.end <= end_date).all()
    tasks_data = []
    for task in tasks:
        tasks_data.append({
            'day_of_week': task.start.weekday(),  # 0 - poniedziałek, 6 - niedziela
            'start_time': task.start.strftime('%H:%M'),
            'end_time': task.end.strftime('%H:%M'),
            'task_title': task.name,
            'task_text': task.description,
            'task_id': task.id_task,
        })

    # weekly
    weekly_repeats = Weekly.query.all()
    for repeat in weekly_repeats:
        for i in range((end_date - start_date).days + 1):
            current_date = start_date + timedelta(days=i)
            # Sprawdź, czy dzień tygodnia pasuje do powtarzalności
            if current_date.weekday() == repeat.weekday:
                task = Task.query.get(repeat.id_task)
                if task:
                    if current_date.date() >= repeat.date_start.date() and current_date.date() <= repeat.date_end.date():
                        tasks_data.append({
                            'day_of_week': current_date.weekday(),
                            'start_time': task.start.strftime('%H:%M'),
                            'end_time': task.end.strftime('%H:%M'),
                            'task_title': f"{task.name}",
                            'task_text': task.description,
                            'task_id': f"repeat-weekly-{repeat.id}-",
                            'color': 'FF5733',
                        })
    monthly_repeats = Monthly.query.all()
    for repeat in monthly_repeats:
        for i in range((end_date - start_date).days + 1):
            current_date = start_date + timedelta(days=i)

            # Sprawdź, czy data mieści się w przedziale dat
            if current_date.date() < repeat.date_start.date() or (
                    repeat.date_end and current_date.date() > repeat.date_end.date()):
                continue

            # Pobierz zadanie raz
            task = Task.query.get(repeat.id_task)
            if not task:
                continue

            # Sprawdzenie powtarzania na podstawie dnia miesiąca
            if repeat.day_of_month and current_date.day == repeat.day_of_month:
                tasks_data.append({
                    'day_of_week': current_date.weekday(),
                    'start_time': task.start.strftime('%H:%M'),
                    'end_time': task.end.strftime('%H:%M'),
                    'task_title': f"{task.name}",
                    'task_text': task.description,
                    'task_id': f"repeat-monthly-{repeat.id}-",
                    'color': 'FF5733',
                })

            # Sprawdzenie powtarzania na podstawie tygodnia miesiąca i dnia tygodnia
            elif repeat.week_of_month and repeat.weekday:
                # Obliczanie numeru tygodnia w miesiącu
                first_day_of_month = current_date.replace(day=1)
                weekday_of_first_day = first_day_of_month.weekday()

                # Określenie numeru tygodnia w miesiącu
                current_week_of_month = (current_date.day - 1) // 7 + 1

                # Jeśli numer tygodnia i dzień tygodnia pasują
                if current_week_of_month == repeat.week_of_month and current_date.weekday() == repeat.weekday:
                    tasks_data.append({
                        'day_of_week': current_date.weekday(),
                        'start_time': task.start.strftime('%H:%M'),
                        'end_time': task.end.strftime('%H:%M'),
                        'task_title': f"{task.name}",
                        'task_text': task.description,
                        'task_id': f"repeat-monthly-{repeat.id}-",
                        'color': 'FF5733',
                    })
    # Yearly
    yearly_repeats = Yearly.query.all()
    for repeat in yearly_repeats:
        for i in range((end_date - start_date).days + 1):
            current_date = start_date + timedelta(days=i)

            # Sprawdzenie, czy powtarzanie w odpowiednim dniu miesiąca i roku
            if current_date.month == repeat.month and current_date.day == repeat.day:
                # Sprawdź, czy data mieści się w przedziale dat
                if current_date.date() >= repeat.date_start.date() and (repeat.date_end is None or current_date.date() <= repeat.date_end.date()):
                    task = Task.query.get(repeat.id_task)
                    if task:
                        tasks_data.append({
                            'day_of_week': current_date.weekday(),
                            'start_time': task.start.strftime('%H:%M'),
                            'end_time': task.end.strftime('%H:%M'),
                            'task_title': f"{task.name}",
                            'task_text': task.description,
                            'task_id': f"repeat-yearly-{repeat.id}-",
                            'color': 'FF5733',
                        })

    return jsonify(tasks_data)


@app.route('/', methods=['GET',"POST"])
def home():
    return app.redirect('/miesiac')

@app.route('/miesiac', methods=['GET',"POST"])
def month():
    if request.method == 'GET':
        date = datetime.now()
        mimetypes.add_type('application/javascript', '.js')
        mimetypes.add_type('text/css', '.css')
        mimetypes.add_type('image/svg+xml', '.svg')
        context = {"request": request}
        return render_template('month.html', date = date, create_calendar=create_calendar, offset = 0,context = context, media_type='text/html')
    
@app.route('/tydzien', methods=['GET',"POST"])
def week():
    if request.method == 'GET':
        test = ['test1', 'test2', 'test3']
        return render_template('week.html', test=test)
    
with app.app_context():
    db.create_all()
    add_test_user()
if __name__ == '__main__':
    app.run(debug = True)