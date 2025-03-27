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
sass = Bundle(
    'sass/global.sass',
    'sass/month.sass', 
    'sass/nav_bar.sass', 
    'sass/small_calendar.sass', 
    'sass/week.sass', 
    'sass/schedule.sass', 
    'sass/add_task.sass', 
    'sass/edit_task.sass', 
    filters=['libsass'], 
    output='all.css'
)
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
# ----------------------------------------------------------------

@app.route('/api/tasks/schedule/<int:year>/<int:month>/<int:day>/<int:future>', methods=['GET'])
def get_tasks_schedule(year, month, day, future=None):
    print(year, month,day, future)
    start_date = datetime(year, month, day)
    tasks_json = []
    
    if future:
        tasks = Task.query.filter(Task.start >= start_date).order_by(Task.start.desc()).limit(5)
    else:
        tasks = Task.query.filter(Task.start <= start_date).order_by(Task.start.asc()).limit(5)
    
    for task in tasks:
        if task.type == 0:
            tasks_json.append({
                'id': task.id_task,
                'name': task.name,
                'start': task.start.strftime('%Y-%m-%d %H:%M:%S'),
                'end': task.end.strftime('%Y-%m-%d %H:%M:%S') if task.end else None,
                'description': task.description,
                'type': task.type,
                'day': task.start.day
            })
            
        if task.type == 1:
            weekly_repeats = Weekly.query.filter_by(id_task=task.id_task).all()
            
            max_date_query = tasks.limit(1)
            for date in max_date_query:
                max_date = date.start
            min_date_query = tasks.limit(1)
            for date in min_date_query:
                min_date = date.start
        
            
            for repeat in weekly_repeats:
                current_date_iter = start_date
                if future:
                    while current_date_iter <= max_date:
                        if current_date_iter.weekday() == repeat.weekday and (repeat.date_start <= current_date_iter and (repeat.date_end is None or current_date_iter <= repeat.date_end)):
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
                        
                else:
                    while current_date_iter >= min_date:
                        if current_date_iter.weekday() == repeat.weekday and (repeat.date_start <= current_date_iter and (repeat.date_end is None or current_date_iter <= repeat.date_end)):
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
                        current_date_iter -= timedelta(days=1)
    
    def create_date(date_time):
        date, time = date_time.split(" ")
        year, month, day = date.split("-")
        hour, minutes, sec = time.split(":")
    
        return datetime(int(year), int(month), int(day), int(hour), int(minutes), int(sec))
    
    tasks_json.sort(key = lambda x: create_date(x["start"]), reverse = not future)                    
            
    return jsonify(tasks_json)    

        

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
        start=datetime(2025, 3, 21, 10, 0),
        end=datetime(2025, 3, 21, 12, 0),
        description='To jest testowe zadanie dodane na sztywno do bazy danych.',
        completed=False,
        id_user=user.id_user,
        type=1
    )
    
    test_task_repeat = Weekly(
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
    
    tasks = Task.query.filter(
        ((Task.start >= first_day) & (Task.start <= last_day)) |
        ((Task.end >= first_day) & (Task.end <= last_day))
    ).all()
    
    recurring_tasks = Task.query.filter(Task.type.in_([1, 2])).all()
    
    tasks_json = []
    
    for task in tasks:
        if task.type == 0:
            tasks_json.append({
                'id': task.id_task,
                'name': task.name,
                'start': task.start.strftime('%Y-%m-%d %H:%M:%S'),
                'end': task.end.strftime('%Y-%m-%d %H:%M:%S') if task.end else None,
                'description': task.description,
                'type': task.type,
                'day': task.start.day
            })
    
    for task in recurring_tasks:
        if task.type == 1:
            weekly_repeats = Weekly.query.filter_by(id_task=task.id_task).all()
            
            for repeat in weekly_repeats:
                current_date_iter = first_day
                while current_date_iter <= last_day:
                    if current_date_iter.weekday() == repeat.weekday and current_date_iter >= current_date and (repeat.date_end is None or current_date_iter <= repeat.date_end):
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
    
        elif task.type == 2:
            monthly_repeats = Monthly.query.filter_by(id_task=task.id_task).all()
            for repeat in monthly_repeats:
                # Jeśli określony jest konkretny dzień miesiąca
                if repeat.day_of_month:
                    last_day_of_month = last_day.day
                    if repeat.day_of_month <= last_day_of_month and (repeat.date_end is None or task_date <= repeat.date_end):
                        task_date = datetime(year, month, repeat.day_of_month)
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
                    first_occurrence = first_day
                    while first_occurrence.weekday() != repeat.weekday:
                        first_occurrence += timedelta(days=1)

                    target_date = first_occurrence + timedelta(weeks=(repeat.week_of_month - 1))

                    if target_date.month == month and target_date >= current_date and (repeat.date_end is None or target_date <= repeat.date_end):
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
                
                elif task.type == 3:
                    yearly_repeats = Yearly.query.filter_by(id_task=task.id_task).all()
                    for repeat in yearly_repeats:
                        # Sprawdź czy zadanie przypada w wybranym miesiącu i roku
                        if repeat.month == month:
                            task_date = datetime(year, month, repeat.day)
                            # Sprawdź czy data zadania mieści się w zakresie powtarzania
                            if task_date >= current_date and (repeat.date_end is None or task_date <= repeat.date_end):
                                tasks_json.append({
                                    'id': task.id_task,
                                    'name': task.name,
                                    'start': task.start.strftime('%Y-%m-%d %H:%M:%S'),
                                    'end': task.end.strftime('%Y-%m-%d %H:%M:%S') if task.end else None,
                                    'description': task.description,
                                    'type': task.type,
                                    'day': repeat.day,
                                    'month': repeat.month
                                })
    
    return jsonify(tasks_json)


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
    
@app.route('/harmonogram', methods=['GET',"POST"])
def schedule():
    if request.method == 'GET':        
        date = datetime.now()
        return render_template('schedule.html', date = date)
    
with app.app_context():
    db.create_all()
    # get_tasks_schedule(2025,3,25)
# odkomentuj aby dodać testowego użytkownika lub zadanie
    # add_test_user()
    # add_test_task()
if __name__ == '__main__':
    app.run(debug = True)
    
