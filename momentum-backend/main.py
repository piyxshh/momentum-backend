import sqlite3
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

class TrackCreate(BaseModel):
    name: str

class Track(BaseModel):
    id: int
    name: str
    last_logged_at: str

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    conn = sqlite3.connect('momentum.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/tracks", response_model=list[Track])
def get_all_tracks():
    conn = get_db_connection()
    tracks_cursor = conn.execute('SELECT id, name, last_logged_at FROM tracks').fetchall()
    conn.close()
    tracks = [dict(row) for row in tracks_cursor]
    return tracks

@app.post("/tracks", response_model=Track, status_code=201)
def create_track(track: TrackCreate):
    conn = get_db_connection()
    initial_log_time = datetime.now(timezone.utc).isoformat()
    cursor = conn.execute(
        'INSERT INTO tracks (name, last_logged_at) VALUES (?, ?)',
        (track.name, initial_log_time)
    )
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"id": new_id, "name": track.name, "last_logged_at": initial_log_time}

@app.post("/tracks/{track_id}/log", status_code=200)
def log_progress_for_track(track_id: int):
    conn = get_db_connection()
    current_time = datetime.now(timezone.utc).isoformat()
    cursor = conn.execute(
        'UPDATE tracks SET last_logged_at = ? WHERE id = ?',
        (current_time, track_id)
    )
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Track with id {track_id} not found")
    conn.commit()
    conn.close()
    return {"message": f"Successfully logged progress for track {track_id}"}

app.delete("/tracks/{track_id}", status_code=204)
def delete_track(track_id: int):
    conn = get_db_connection()
    cursor = conn.execute('DELETE FROM tracks WHERE id = ?', (track_id,))
    
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Track with id {track_id} not found")

    conn.commit()
    conn.close()
    return
