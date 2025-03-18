from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Initialize SQLAlchemy (this will be used in app.py)
db = SQLAlchemy()

# Define the Users table
class User(db.Model):
    __tablename__ = 'User'
    id_user: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nickname: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(60), nullable=False)
    phone_number: Mapped[int] = mapped_column(Integer, nullable=True)

    def __repr__(self):
        return f'<User id: {self.id_user} nickname: {self.nickname}>'

# Define the Tasks table
class Task(db.Model):
    __tablename__ = 'Task'
    id_task: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False) 
    start: Mapped[str] = mapped_column(DateTime, nullable=False)
    end: Mapped[str] = mapped_column(DateTime, nullable=True)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    id_user: Mapped[int] = mapped_column(Integer, ForeignKey('User.id_user'), nullable=False)  # Foreign key to Users table
    type: Mapped[int] = mapped_column(Integer, nullable=False)

    #user = db.relationship('User', backref=db.backref('Task', lazy=True))
    


    def __repr__(self):
        return f'<Task id: {self.id_task} name: {self.name}>'

# Define the TaskRepeatWeekly table
class TaskRepeatWeekly(db.Model):
    __tablename__ = 'TaskRepeatWeekly'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_task: Mapped[int] = mapped_column(Integer, ForeignKey('Task.id_task'), nullable=False)  # Foreign key to Tasks table
    weekday: Mapped[int] = mapped_column(Integer, nullable=False)

    #task = db.relationship('Task', backref=db.backref('TaskRepeatWeekly', lazy=True))

    def __repr__(self):
        return f'<TaskRepeatWeekly TaskID {self.id_task} Weekday {self.weekday}>'

# Define the TaskRepeatMonthly table
class TaskRepeatMonthly(db.Model):
    __tablename__ = 'TaskRepeatMonthly'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_task: Mapped[int] = mapped_column(Integer, ForeignKey('Task.id_task'), nullable=False)  # Foreign key to Tasks table
    day_of_month: Mapped[int] = mapped_column(Integer, nullable=True)
    week_of_month: Mapped[int] = mapped_column(Integer, nullable=True)
    weekday: Mapped[int] = mapped_column(Integer, nullable=True)

    #task = db.relationship('Task', backref=db.backref('monthly_repeats', lazy=True))

    def __repr__(self):
        return f'<TaskRepeatMonthly TaskID {self.id_task} Day {self.day_of_month} Week {self.week_of_month} Weekday {self.weekday}>'
