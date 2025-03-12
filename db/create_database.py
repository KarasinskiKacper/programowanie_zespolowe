from database import Database

db = Database()

cursor = db.connect("./db/database.db")

sql_users = '''create table if not exists Users(
    ID integer primary key autoincrement,
    Nickname varchar(25) not null unique,
    Email varchar(50) not null unique,
    Password varchar(25) not null,
    Phone_number integer(9)
    )'''
cursor.execute(sql_users)

sql_tasks = '''create table if not exists Tasks(
    Task_ID integer primary key autoincrement,
    Name varchar(25) not null,
    Date datetime not null,
    Description varchar(500),
    User_ID integer,
    constraint fk_User_Task foreign key(User_ID) references Users(ID)
    )'''
    
cursor.execute(sql_tasks)

db.disconnect()