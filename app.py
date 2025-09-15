import sqlite3

connection = sqlite3.connect("momentum.db")

cursor =  connection.cursor()

create_table_query = """
CREATE TABLE IF NOT EXISTS tracks(
id INTEGER PRIMARY KEY,
name Text,
last_logged_at TEXT
);
"""

cursor.execute(create_table_query)

connection.commit()

connection.close()

print("Database and 'tracks' table created successfully!")