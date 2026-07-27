from database.db import get_connection


# ==========================================
# Save URL Scan
# ==========================================

def save_scan(url, result, trust):
    conn = get_connection()

    try:
        conn.execute(
            """
            INSERT INTO scan_history(
                scan_type,
                url,
                message,
                status,
                trust_score,
                risk,
                confidence
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "url",
                url,
                None,
                result["status"],
                trust["trust_score"],
                result["risk"],
                None,
            ),
        )

        conn.commit()

    finally:
        conn.close()


# ==========================================
# Save Message Scan
# ==========================================

def save_message_scan(
    message,
    result,
    confidence,
):
    conn = get_connection()

    try:
        conn.execute(
            """
            INSERT INTO scan_history(
                scan_type,
                url,
                message,
                status,
                trust_score,
                risk,
                confidence
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "message",
                None,
                message,
                result["status"],
                None,
                result["risk"],
                confidence,
            ),
        )

        conn.commit()

    finally:
        conn.close()


# ==========================================
# Save Screenshot Scan
# ==========================================

def save_screenshot_scan(
    filename,
    ocr_text,
    result,
    confidence,
):
    conn = get_connection()

    try:
        preview_parts = []

        if filename:
            preview_parts.append(f"File: {filename}")

        if ocr_text:
            preview_parts.append(
                ocr_text.strip().replace("\n", " ")[:500]
            )

        message_summary = (
            " | ".join(preview_parts)
            if preview_parts
            else "Screenshot scan"
        )

        conn.execute(
            """
            INSERT INTO scan_history(
                scan_type,
                url,
                message,
                status,
                trust_score,
                risk,
                confidence
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "screenshot",
                None,
                message_summary,
                result["status"],
                None,
                result["risk"],
                confidence,
            ),
        )

        conn.commit()

    finally:
        conn.close()


# ==========================================
# Get Scan History
# ==========================================

def get_history():
    conn = get_connection()

    try:
        rows = conn.execute(
            """
            SELECT
                id,
                scan_type,
                url,
                message,
                status,
                trust_score,
                risk,
                confidence,
                scan_time
            FROM scan_history
            ORDER BY scan_time DESC, id DESC
            """
        ).fetchall()

        return [
            dict(row)
            for row in rows
        ]

    finally:
        conn.close()


# ==========================================
# Delete Scan
# ==========================================

def delete_scan(scan_id):
    conn = get_connection()

    try:
        conn.execute(
            """
            DELETE FROM scan_history
            WHERE id = ?
            """,
            (scan_id,),
        )

        conn.commit()

    finally:
        conn.close()