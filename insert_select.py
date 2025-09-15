import sqlite3

connection = sqlite3.connect("momentum.db")
cursor = connection.cursor()

cursor.execute("""
INSERT INTO tracks (name, last_logged_at)
VALUES (?, ?)
""", ("Learn Python", "2025-09-12 10:00:00"))

connection.commit()
print("New track inserted!")

cursor.execute("SELECT * FROM tracks")
rows = cursor.fetchall()

print("\n Tracks in database:")
for row in rows:
    print(row)

connection.close()    
