import sqlite3
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DB_NAME = BASE_DIR / "history.db"


def get_connection():
    conn = sqlite3.connect(DB_NAME)

    conn.row_factory = sqlite3.Row

    return conn


def column_exists(conn, table_name, column_name):
    cursor = conn.execute(
        f"PRAGMA table_info({table_name})"
    )

    columns = [
        row["name"]
        for row in cursor.fetchall()
    ]

    return column_name in columns


def initialize_database():
    conn = get_connection()

    # Create scan history table for new installations
    conn.execute("""
        CREATE TABLE IF NOT EXISTS scan_history(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scan_type TEXT DEFAULT 'url',
            url TEXT,
            message TEXT,
            status TEXT,
            trust_score INTEGER,
            risk INTEGER,
            confidence INTEGER,
            scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # ==========================================
    # Database Migration
    # ==========================================
    # Add new columns to an existing database
    # without deleting previous URL scan history.

    if not column_exists(
        conn,
        "scan_history",
        "scan_type",
    ):
        conn.execute("""
            ALTER TABLE scan_history
            ADD COLUMN scan_type TEXT DEFAULT 'url'
        """)

    if not column_exists(
        conn,
        "scan_history",
        "message",
    ):
        conn.execute("""
            ALTER TABLE scan_history
            ADD COLUMN message TEXT
        """)

    if not column_exists(
        conn,
        "scan_history",
        "confidence",
    ):
        conn.execute("""
            ALTER TABLE scan_history
            ADD COLUMN confidence INTEGER
        """)

    # Mark old records as URL scans
    conn.execute("""
        UPDATE scan_history
        SET scan_type = 'url'
        WHERE scan_type IS NULL
           OR TRIM(scan_type) = ''
    """)

    conn.commit()

    conn.close()