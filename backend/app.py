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
    'sass/login.sass', 
    filters=['libsass'], 
    output='all.css'
)
assets.register('sass_all', sass)

# Inicjalizacja bazy danych
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, os.pardir, 'db', 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Ustalony horyzont przeszukiwania (w dniach)
HORIZON_DAYS = 60

@app.route('/api/tasks/schedule/<int:year>/<int:month>/<int:day>/<int:future>', methods=['GET'])
def get_tasks_schedule(year, month, day, future=None):
    if future == 0:
        future = None

    #  data wejściowa (bez względu na kierunek)
    start_date = datetime(year, month, day)
    tasks_json = []

    # Ustalenie horyzontu wyszukiwania
    if future:
        end_date = start_date + timedelta(days=HORIZON_DAYS)
        # Pobieranie zadań jednorazowych (type==0) mieszczących się w przedziale
        one_time_tasks = Task.query.filter(
            Task.type == 0,
            Task.start >= start_date,
            Task.start <= end_date
        ).order_by(Task.start.asc()).all()
    else:
        end_date = start_date - timedelta(days=HORIZON_DAYS)
        # Dla zadań przeszłych pobranie tych, które mieszczą się w przedziale
        one_time_tasks = Task.query.filter(
            Task.type == 0,
            Task.start <= start_date,
            Task.start >= end_date
        ).order_by(Task.start.desc()).all()

    # Pobieranie wszystkich zadań powtarzalnych (typy 1, 2 i 3)
    recurring_tasks = Task.query.filter(Task.type.in_([1, 2, 3])).all()

    # Ustalenie formatu iteracji – przeszukiwanie dzień po dniu w obrębie horyzontu
    if future:
        current_date = start_date
        delta = timedelta(days=1)
        condition = lambda d: d <= end_date
    else:
        current_date = start_date
        delta = -timedelta(days=1)
        condition = lambda d: d >= end_date

    # Iteracja po dniach w obrębie horyzontu
    while condition(current_date):
        # Przetwarzanie zadań jednorazowych (type==0):
        for task in one_time_tasks[:]:
            if task.start.date() == current_date.date():
                tasks_json.append({
                    'id': task.id_task,
                    'name': task.name,
                    'start': task.start.strftime('%Y-%m-%d %H:%M:%S'),
                    'end': task.end.strftime('%Y-%m-%d %H:%M:%S') if task.end else None,
                    'description': task.description,
                    'type': task.type,
                    'day': task.start.day
                })
                one_time_tasks.remove(task)  # usuwanie żeby nie sprawdzać ponownie

        # 2. Przetwarzanie zadań powtarzalnych:
        for task in recurring_tasks:
            # Zadania tygodniowe (type == 1)
            if task.type == 1:
                weekly_repeats = Weekly.query.filter_by(id_task=task.id_task).all()
                for repeat in weekly_repeats:
                    if current_date.date() >= repeat.date_start.date() and \
                       (repeat.date_end is None or current_date.date() <= repeat.date_end.date()):
                        if current_date.weekday() == repeat.weekday:
                            new_start = datetime.combine(current_date.date(), task.start.time())
                            new_end = datetime.combine(current_date.date(), task.end.time()) if task.end else None
                            tasks_json.append({
                                'id': task.id_task,
                                'name': task.name,
                                'start': new_start.strftime('%Y-%m-%d %H:%M:%S'),
                                'end': new_end.strftime('%Y-%m-%d %H:%M:%S') if new_end else None,
                                'description': task.description,
                                'type': task.type,
                                'day': current_date.day,
                                'weekday': repeat.weekday
                            })
            # Zadania miesięczne (type == 2)
            elif task.type == 2:
                monthly_repeats = Monthly.query.filter_by(id_task=task.id_task).all()
                for repeat in monthly_repeats:
                    # Pominięcie, jeśli dany dzień jest poza zakresem powtarzania
                    if current_date.date() < repeat.date_start.date() or (
                        repeat.date_end and current_date.date() > repeat.date_end.date()):
                        continue
                    # Jeśli określono konkretny dzień miesiąca
                    if repeat.day_of_month and current_date.day == repeat.day_of_month:
                        new_start = datetime.combine(current_date.date(), task.start.time())
                        new_end = datetime.combine(current_date.date(), task.end.time()) if task.end else None
                        tasks_json.append({
                            'id': task.id_task,
                            'name': task.name,
                            'start': new_start.strftime('%Y-%m-%d %H:%M:%S'),
                            'end': new_end.strftime('%Y-%m-%d %H:%M:%S') if new_end else None,
                            'description': task.description,
                            'type': task.type,
                            'day': current_date.day,
                            'day_of_month': repeat.day_of_month
                        })
                    # Alternatywnie, powtarzanie wg tygodnia miesiąca i dnia tygodnia
                    elif repeat.week_of_month and repeat.weekday is not None:
                        current_week = ((current_date.day - 1) // 7) + 1
                        if current_week == repeat.week_of_month and current_date.weekday() == repeat.weekday:
                            new_start = datetime.combine(current_date.date(), task.start.time())
                            new_end = datetime.combine(current_date.date(), task.end.time()) if task.end else None
                            tasks_json.append({
                                'id': task.id_task,
                                'name': task.name,
                                'start': new_start.strftime('%Y-%m-%d %H:%M:%S'),
                                'end': new_end.strftime('%Y-%m-%d %H:%M:%S') if new_end else None,
                                'description': task.description,
                                'type': task.type,
                                'day': current_date.day,
                                'week_of_month': repeat.week_of_month,
                                'weekday': repeat.weekday
                            })
            # Zadania roczne (type == 3)
            elif task.type == 3:
                yearly_repeats = Yearly.query.filter_by(id_task=task.id_task).all()
                for repeat in yearly_repeats:
                    if current_date.date() < repeat.date_start.date() or (
                        repeat.date_end and current_date.date() > repeat.date_end.date()):
                        continue
                    if current_date.month == repeat.month and current_date.day == repeat.day:
                        new_start = datetime.combine(current_date.date(), task.start.time())
                        new_end = datetime.combine(current_date.date(), task.end.time()) if task.end else None
                        tasks_json.append({
                            'id': task.id_task,
                            'name': task.name,
                            'start': new_start.strftime('%Y-%m-%d %H:%M:%S'),
                            'end': new_end.strftime('%Y-%m-%d %H:%M:%S') if new_end else None,
                            'description': task.description,
                            'type': task.type,
                            'day': current_date.day,
                            'month': repeat.month
                        })
        current_date += delta

                            
                        
    
    def create_date(date_time):
        date, time = date_time.split(" ")
        year, month, day = date.split("-")
        hour, minutes, sec = time.split(":")
    
        return datetime(int(year), int(month), int(day), int(hour), int(minutes), int(sec))
    
    tasks_json.sort(key = lambda x: create_date(x["start"]), reverse = False)
    # print(tasks_json)       
    return jsonify(tasks_json)
    

        

@app.route('/tasks', methods=['GET'])
def get_tasks_week():
    # Pobranie i sparsowanie dat z query params
    start_date = datetime.fromisoformat(request.args.get('start_date'))
    end_date = datetime.fromisoformat(request.args.get('end_date')).replace(hour=23, minute=59, second=59)


    # Zadania jednorazowe w przedziale
    tasks = Task.query.filter(Task.start >= start_date, Task.end <= end_date).all()
    tasks_data = []
    i = 0
    for task in tasks:
        i += 1
        tasks_data.append({
            'day_of_week': task.start.weekday(),  # 0 - poniedziałek, 6 - niedziela
            'start_time': task.start.strftime('%H:%M'),
            'end_time': task.end.strftime('%H:%M'),
            'task_title': task.name,
            'task_text': task.description,
            'task_id': task.id_task,
            'color': str(task.color[1:]),
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
                            'color': str(task.color[1:]),
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
                    'color': str(task.color[1:]),
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
                        'color': str(task.color[1:]),
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
                            'end_time': task.end.strftime('%H:%M') if task.end else None,
                            'task_title': f"{task.name}",
                            'task_text': task.description,
                            'task_id': f"repeat-yearly-{repeat.id}-",
                            'color': 'FF5733',
                        })

    return jsonify(tasks_data)

@app.route('/api/tasks/delete', methods=['POST'])
def delete_task():
    # Znajdź zadanie
    task_id = request.json['task_id']
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({"error": "Zadanie nie zostało znalezione"}), 404

    
    # Sprawdź typ zadania i usuń powiązane rekordy
    if task.type == 1:  # Zadanie tygodniowe
        Weekly.query.filter_by(id_task=task_id).delete()
    elif task.type == 2:  # Zadanie miesięczne
        print(Monthly.query.filter_by(id_task=task_id))
    elif task.type == 3:  # Zadanie roczne
        Yearly.query.filter_by(id_task=task_id).delete()
        
    
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify(status="OK"), 200

@app.route('/api/tasks/edit', methods=['POST'])
def edit_task():
    task_id = request.json['task_id']
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Zadanie nie zostało znalezione"}), 404
    old_task_type = task.type
    
    task_type ={
    "none": 0,
    "daily": 1,
    "weekly": 1,
    "monthly": 2,
    "yearly": 3
    }
    data = request.json # Pobranie JSON-a z formularza
    name = data.get('title')
    description = data.get('description')
    #data startu
    start_date = data.get('start_date')
    start_hour = data.get('start_hour')
    start = start_hour + " " + start_date
    start = datetime.strptime(start, '%H:%M %Y-%m-%d')
    #data końca
    end_date = data.get('end_date')
    end_hour = data.get('end_hour')
    
    end = end_hour + " " + end_date
    end = datetime.strptime(end, '%H:%M %Y-%m-%d')
    
    end_task = end_hour + " " + start_date
    end_task = datetime.strptime(end_task, '%H:%M %Y-%m-%d')
    
    type_task = task_type[data.get('repeat_type')]
    daily = True if data.get('repeat_type') == "daily" else False
    color = data.get('color')
    id_user = 1
    print(name, description, start, end, type_task, daily, id_user)
    db.session.query(Task).filter(Task.id_task == task_id).update({
        Task.name: name,
        Task.description: description,
        Task.start: start,
        Task.end: end_task,
        Task.type: type_task,
        Task.color: color,
    })
    if type_task == 1 and daily == True:
        Weekly.query.filter_by(id_task=task_id).delete()
        weekday = start.weekday()
        i = 0
        number_of_day = datetime.strptime(end_date, '%Y-%m-%d').date() - datetime.strptime(start_date,'%Y-%m-%d').date()
        if number_of_day.days <= 5:
            number_of_day = number_of_day.days
        else:
            number_of_day = 6
        while i <= number_of_day:
            daily_task = Weekly(
                id_task=task_id,
                weekday=(weekday + i) % 7,
                date_start=start,
                date_end=end
            )
            db.session.add(daily_task)
            i += 1
        db.session.commit()
    if type_task == old_task_type:
        if type_task == 1 and daily == False:
            db.session.query(Weekly).filter(Weekly.id_task == task_id).update({
                Weekly.weekday: start.weekday(),
                Weekly.date_start: start,
                Weekly.date_end: end
            })

        elif type_task == 2:
            db.session.query(Monthly).filter(Monthly.id_task == task_id).update({
                Monthly.day_of_month: start.day,
                Monthly.date_start: start,
                Monthly.date_end: end
            })
        elif type_task == 3:
            db.session.query(Yearly).filter(Yearly.id_task == task_id).update({
                Yearly.day: start.day,
                Yearly.month: start.month,
                Yearly.date_start: start,
                Yearly.date_end: end
            })
    else:
        if task.type == 1 and daily == False:  # Zadanie tygodniowe
            Weekly.query.filter_by(id_task=task_id).delete()
        elif task.type == 2:  # Zadanie miesięczne
            Monthly.query.filter_by(id_task=task_id).delete()
        elif task.type == 3:  # Zadanie roczne
            Yearly.query.filter_by(id_task=task_id).delete()
        
        if type_task == 1 and daily == False:
            db.session.add(
                Weekly(
                id_task=task_id, 
                weekday=start.weekday(), 
                date_start=datetime.strptime(start_date, '%Y-%m-%d'), 
                date_end=end
                ))
        elif type_task == 2:
            db.session.add(
                Monthly(
                id_task=task_id, 
                day_of_month=start.day,
                date_start=datetime.strptime(start_date, '%Y-%m-%d'), 
                date_end=end
                ))
        elif type_task == 3:
            db.session.add(
                Yearly(
                id_task=task_id, 
                day=start.day, 
                month=start.month, 
                date_start=datetime.strptime(start_date, '%Y-%m-%d'), 
                date_end=end
                ))

    db.session.commit()
    
    return jsonify(status="OK"), 200
    

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
    
    recurring_tasks = Task.query.filter(Task.type.in_([1, 2, 3])).all()
    
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
                    if current_date_iter.weekday() == repeat.weekday and current_date_iter >= repeat.date_start-timedelta(days=1) and (repeat.date_end is None or current_date_iter <= repeat.date_end):
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
                    task_date = datetime(year, month, repeat.day_of_month)
                    if repeat.day_of_month <= last_day_of_month and (repeat.date_end is None or task_date <= repeat.date_end):
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
                    task_date = datetime(year, repeat.month, repeat.day)
                    print(task_date)
                    # Sprawdź czy data zadania mieści się w zakresie powtarzania
                    if (repeat.date_end is None or task_date <= repeat.date_end):
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

@app.route("/add-task", methods=["POST"])
def add_task():
    task_type ={
    "none": 0,
    "daily": 1,
    "weekly": 1,
    "monthly": 2,
    "yearly": 3
    }
    data = request.json # Pobranie JSON-a z formularza
    name = data.get('title')
    description = data.get('description')
    #data startu
    start_date = data.get('start_date')
    start_hour = data.get('start_hour')
    start = start_hour + " " + start_date
    #data końca
    end_date = data.get('end_date')
    end_hour = data.get('end_hour')
    end = end_hour + " " + end_date
    end_task = end_hour + " " + start_date
    type_task = task_type[data.get('repeat_type')]
    daily = True if data.get('repeat_type') == "daily" else False
    color = data.get('color')
    id_user = 1

    test_task = Task(
        name=name,
        start=datetime.strptime(start, '%H:%M %Y-%m-%d'),
        end=datetime.strptime(end_task, '%H:%M %Y-%m-%d'),
        description=description,
        completed=False,
        id_user=id_user,
        type= int(type_task),
        color=color
    )

    db.session.add(test_task)
    db.session.commit()
    id_task = test_task.id_task


    if type_task == 1 and daily:
        weekday = datetime.strptime(start, '%H:%M %Y-%m-%d').weekday()
        i = 0
        number_of_day = datetime.strptime(end_date, '%Y-%m-%d').date() - datetime.strptime(start_date, '%Y-%m-%d').date()
        if number_of_day.days <= 5:
            number_of_day = number_of_day.days
        else:
            number_of_day = 6
        while i <= number_of_day:
            daily_task = Weekly(
                id_task=id_task,
                weekday = (weekday+i)%7,
                date_start = datetime.strptime(start, '%H:%M %Y-%m-%d'),
                date_end = datetime.strptime(end, '%H:%M %Y-%m-%d')
            )
            db.session.add(daily_task)
            i += 1
        db.session.commit()
    elif type_task == 1 and daily == False:
        weekday = datetime.strptime(start, '%H:%M %Y-%m-%d').weekday()
        weekly_task = Weekly(
                id_task=id_task,
                weekday = weekday,
                date_start = datetime.strptime(start, '%H:%M %Y-%m-%d'),
                date_end = datetime.strptime(end, '%H:%M %Y-%m-%d')
            )
        db.session.add(weekly_task)
        db.session.commit()
    elif type_task == 2:
        day_of_month = datetime.strptime(start, '%H:%M %Y-%m-%d').day
        monthly_task = Monthly(
                id_task=id_task,
                day_of_month=day_of_month,
                date_start = datetime.strptime(start, '%H:%M %Y-%m-%d'),
                date_end = datetime.strptime(end, '%H:%M %Y-%m-%d')
            )
        db.session.add(monthly_task)
        db.session.commit()
    elif type_task == 3:
        day = datetime.strptime(start, '%H:%M %Y-%m-%d').day
        month = datetime.strptime(start, '%H:%M %Y-%m-%d').month
        yearly_task = Yearly(
                id_task=id_task,
                day=day,
                month=month,
                date_start = datetime.strptime(start, '%H:%M %Y-%m-%d'),
                date_end = datetime.strptime(end, '%H:%M %Y-%m-%d')
            )
        db.session.add(yearly_task)
        db.session.commit()

    return jsonify(status="OK"), 200

@app.route('/', methods=['GET',"POST"])
def home():
    return app.redirect('/miesiac')

@app.route('/login', methods=['GET',"POST"])
def login():
    if request.method == 'GET':
        return render_template('login.html')

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
    
