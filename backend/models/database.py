import sqlite3

DB_NAME = "tobelist.db"

def initialize_database():
    """Create tables if they don't exist."""
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS habits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                frequency TEXT,
                next_due DATE
            )
        ''')

        # Create the log table to track habit progress
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS habit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                habit_id INTEGER,
                log_date DATE,
                FOREIGN KEY (habit_id) REFERENCES habits (id)
            )
        ''')

        conn.commit()

def get_db_connection():
    """Create a new database connection."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn
