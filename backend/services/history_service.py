from database.db import get_connection


def save_scan(url, result, trust):

    conn = get_connection()

    conn.execute(
        """
        INSERT INTO scan_history(
            url,
            status,
            trust_score,
            risk
        )
        VALUES (?,?,?,?)
        """,
        (
            url,
            result["status"],
            trust["trust_score"],
            result["risk"],
        ),
    )

    conn.commit()
    conn.close()


def get_history():

    conn = get_connection()

    rows = conn.execute("""
        SELECT *
        FROM scan_history
        ORDER BY scan_time DESC
    """).fetchall()

    conn.close()

    return [dict(r) for r in rows]


def delete_scan(scan_id):

    conn = get_connection()

    conn.execute(
        "DELETE FROM scan_history WHERE id=?",
        (scan_id,),
    )

    conn.commit()
    conn.close()