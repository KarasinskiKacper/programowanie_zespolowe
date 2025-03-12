import sqlite3


class Database:
    def __init__(self):
        self.db_path = None
        self.connection = None
        
    def connect(self, db_path):
        self.db_path = db_path
        self.connection = sqlite3.connect(f'{db_path}')
        print("Connected to SQLite database")
        cursor = self.connection.cursor()
        return cursor
    
    def commit(self):
        self.connection.commit()
    
    def disconnect(self):
        self.connection.close()
        print("Disconnected from SQLite database")