import sqlite3
import os


def db():
    # Get DB path
    db_name = "tiger-home.db"
    db_path = os.path.join(os.getcwd(),
                           '../data',
                           db_name)

    # Create the DB
    return sqlite3.connect(db_path)
