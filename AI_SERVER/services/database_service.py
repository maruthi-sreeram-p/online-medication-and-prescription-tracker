import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3306")),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )

def get_user_medications(patient_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                m.name AS medicine_name,
                pm.dosage,
                pm.frequency,
                pm.duration_days,
                pm.morning_meal,
                pm.morning_time_start,
                pm.afternoon_meal,
                pm.afternoon_time_start,
                pm.night_meal,
                pm.night_time_start
            FROM prescription_medicines pm
            JOIN medicines m ON m.id = pm.medicine_id
            JOIN prescriptions p ON p.id = pm.prescription_id
            WHERE p.patient_id = %s
        """, (patient_id,))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        if not rows:
            return []
        medications = []
        for r in rows:
            schedule = []
            if r['morning_meal']:
                schedule.append(f"morning at {r['morning_time_start']}")
            if r['afternoon_meal']:
                schedule.append(f"afternoon at {r['afternoon_time_start']}")
            if r['night_meal']:
                schedule.append(f"night at {r['night_time_start']}")
            med = (
                f"{r['medicine_name']} {r['dosage']} - "
                f"{r['frequency']} - "
                f"Schedule: {', '.join(schedule)} - "
                f"Duration: {r['duration_days']} days"
            )
            medications.append(med)
        return medications
    except Exception as e:
        print(f"=== DB ERROR: {e} ===")
        return []

def save_chat_history(user_id, user_message, bot_reply):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO chat_history
            (user_id, user_message, bot_reply, timestamp)
            VALUES (%s, %s, %s, NOW())
        """, (user_id, user_message, bot_reply))
        conn.commit()
        cursor.close()
        conn.close()
        print("=== Chat saved ===")
    except Exception as e:
        print(f"=== DB ERROR saving chat: {e} ===")

def get_chat_history(user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT user_message, bot_reply, timestamp
            FROM chat_history
            WHERE user_id = %s
            ORDER BY timestamp ASC
        """, (user_id,))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as e:
        print(f"=== DB ERROR fetching history: {e} ===")
        return []