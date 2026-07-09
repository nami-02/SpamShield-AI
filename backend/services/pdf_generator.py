from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import os

REPORT_FOLDER = "reports"

os.makedirs(REPORT_FOLDER, exist_ok=True)


def generate_pdf(data):

    filename = f"{REPORT_FOLDER}/report.pdf"

    styles = getSampleStyleSheet()

    doc = SimpleDocTemplate(filename)

    story = []

    story.append(Paragraph("<b>SpamShield AI Security Report</b>", styles["Title"]))

    story.append(Paragraph(f"<b>URL:</b> {data['url']}", styles["BodyText"]))
    story.append(Paragraph(f"<b>Status:</b> {data['status']}", styles["BodyText"]))
    story.append(Paragraph(f"<b>Trust Score:</b> {data['trust']['trust_score']}", styles["BodyText"]))
    story.append(Paragraph(f"<b>Risk Level:</b> {data['trust']['risk_level']}", styles["BodyText"]))
    story.append(Paragraph(f"<b>AI Prediction:</b> {data['ai_prediction']}", styles["BodyText"]))

    story.append(Paragraph("<b>Reasons</b>", styles["Heading2"]))

    for reason in data["explanation"]:
        story.append(Paragraph(f"• {reason}", styles["BodyText"]))

    doc.build(story)

    return filename