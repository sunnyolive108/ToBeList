from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.database import get_db_connection
from datetime import date

router = APIRouter(prefix="/habits", tags=["Habits"])

class Habit(BaseModel):
    name: str
    description: str | None = None
    frequency: str
    next_due: str

@router.post("/")
def create_habit(habit: Habit):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO habits (name, description, frequency, next_due)
            VALUES (?, ?, ?, ?)
        ''', (habit.name, habit.description, habit.frequency, habit.next_due))
        conn.commit()
    return {"message": "Habit created successfully"}

@router.get("/")
def list_habits():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM habits")
        habits = cursor.fetchall()
    return [dict(habit) for habit in habits]

@router.put("/{habit_id}")
def update_habit(habit_id: int, habit: Habit):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE habits
            SET name = ?, description = ?, frequency = ?, next_due = ?
            WHERE id = ?
        ''', (habit.name, habit.description, habit.frequency, habit.next_due, habit_id))
        conn.commit()
    return {"message": "Habit updated successfully"}

@router.delete("/{habit_id}")
def delete_habit(habit_id: int):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM habits WHERE id = ?", (habit_id,))
        conn.commit()
    return {"message": "Habit deleted successfully"}

@router.post("/{habit_id}/log")
async def log_habit_progress(habit_id: int):
    """Log progress for a habit by adding a timestamp."""
    today = date.today()
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        '''
        INSERT INTO habit_logs (habit_id, log_date)
        VALUES (?, ?)
        ''',
        (habit_id, today)
    )
    connection.commit()

    cursor.close()
    return {"message": "Habit progress logged successfully"}

@router.get("/{habit_id}/log")
def get_habit_logs(habit_id: int):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM habit_logs WHERE habit_id = ?", (habit_id,))
        logs = cursor.fetchall()
    return [dict(log) for log in logs]
