from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Inicjalizacja SQLAlchemy
db = SQLAlchemy()

# Definicja tabeli User
class User(db.Model):
    __tablename__ = 'User'
    id_user: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nickname: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(60), nullable=False)
    phone_number: Mapped[int] = mapped_column(Integer, nullable=True)

    def __repr__(self):
        return f'<User id: {self.id_user} nickname: {self.nickname}>'

# Definicja tabeli Task
class Task(db.Model):
    __tablename__ = 'Task'
    id_task: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    start: Mapped[str] = mapped_column(DateTime, nullable=False)
    end: Mapped[str] = mapped_column(DateTime, nullable=True)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    completed: Mapped[int] = mapped_column(Integer, nullable=False)
    id_user: Mapped[int] = mapped_column(Integer, ForeignKey('User.id_user'), nullable=False)
    type: Mapped[int] = mapped_column(Integer, nullable=False)

    def __repr__(self):
        return f'<Task id: {self.id_task} name: {self.name}>'

# Definicja tabeli Weekly
class Weekly(db.Model):
    __tablename__ = 'Weekly'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_task: Mapped[int] = mapped_column(Integer, ForeignKey('Task.id_task'), nullable=False)
    weekday: Mapped[int] = mapped_column(Integer, nullable=False)
    date_start: Mapped[str] = mapped_column(DateTime, nullable=False)
    date_end: Mapped[str] = mapped_column(DateTime, nullable=True)

    def __repr__(self):
        return f'<TaskRepeatWeekly TaskID {self.id_task} Weekday {self.weekday}>'

# Definicja tabeli Monthly
class Monthly(db.Model):
    __tablename__ = 'Monthly'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_task: Mapped[int] = mapped_column(Integer, ForeignKey('Task.id_task'), nullable=False)
    day_of_month: Mapped[int] = mapped_column(Integer, nullable=True)
    week_of_month: Mapped[int] = mapped_column(Integer, nullable=True)
    weekday: Mapped[int] = mapped_column(Integer, nullable=True)
    date_start: Mapped[str] = mapped_column(DateTime, nullable=False)
    date_end: Mapped[str] = mapped_column(DateTime, nullable=True)

    def __repr__(self):
        return f'<TaskRepeatMonthly TaskID {self.id_task} Day {self.day_of_month} Week {self.week_of_month} Weekday {self.weekday}>'

# Definicja tabeli Yearly
class Yearly(db.Model):
    __tablename__ = 'Yearly'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_task: Mapped[int] = mapped_column(Integer, ForeignKey('Task.id_task'), nullable=False)
    month: Mapped[int] = mapped_column(Integer, nullable=False)
    day: Mapped[int] = mapped_column(Integer, nullable=False)
    date_start: Mapped[str] = mapped_column(DateTime, nullable=False)
    date_end: Mapped[str] = mapped_column(DateTime, nullable=True)

    def __repr__(self):
        return f'<TaskRepeatYearly TaskID {self.id_task} Month {self.month} Day {self.day}>'