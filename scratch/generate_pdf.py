import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
)
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HEADER_IMG_PATH = 'scratch/img_0_0_Image25.jpg'
OUTPUT_PDF_1 = 'public/CISABZ-2K26_Event_Guidelines.pdf'
OUTPUT_PDF_2 = 'public/CISABZ-2K26_Event_Guidelines_v2.pdf'
OUTPUT_PDF_3 = 'public/CISABZ-2K26_Updated_Official_Event_Guidelines.pdf'

# Register Original Times New Roman TTF fonts & Georgia for inline Rupee symbol
pdfmetrics.registerFont(TTFont('TimesNewRoman', '/System/Library/Fonts/Supplemental/Times New Roman.ttf'))
pdfmetrics.registerFont(TTFont('TimesNewRoman-Bold', '/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf'))
pdfmetrics.registerFont(TTFont('TimesNewRoman-Italic', '/System/Library/Fonts/Supplemental/Times New Roman Italic.ttf'))
pdfmetrics.registerFont(TTFont('TimesNewRoman-BoldItalic', '/System/Library/Fonts/Supplemental/Times New Roman Bold Italic.ttf'))
pdfmetrics.registerFont(TTFont('Georgia', '/System/Library/Fonts/Supplemental/Georgia.ttf'))

class BorderedCanvas(canvas.Canvas):
    """Canvas callback to draw a clean rectangular border around every page and set document metadata."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []
        self.setTitle("CISABZ-2K26 Guidelines")
        self.setAuthor("Department of Computer Science and Engineering - Kings College of Engineering")
        self.setSubject("CISABZ-2K26 Event Rules & Guidelines")

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        for page in self.pages:
            self.__dict__.update(page)
            self.draw_border()
            super().showPage()
        super().save()

    def draw_border(self):
        self.saveState()
        self.setStrokeColor(colors.HexColor('#000000'))
        self.setLineWidth(1.0)
        self.rect(30, 30, A4[0] - 60, A4[1] - 60)
        self.restoreState()

def build_pdf_file(target_filename):
    doc = SimpleDocTemplate(
        target_filename,
        pagesize=A4,
        leftMargin=45,
        rightMargin=45,
        topMargin=40,
        bottomMargin=40,
        title="CISABZ-2K26 Guidelines",
        author="Department of Computer Science and Engineering - Kings College of Engineering",
        subject="CISABZ-2K26 Technical & Non-Technical Event Guidelines"
    )

    styles = getSampleStyleSheet()

    dept_style = ParagraphStyle(
        'DeptTitle',
        parent=styles['Normal'],
        fontName='TimesNewRoman-Bold',
        fontSize=13.5,
        leading=17,
        alignment=1,
        textColor=colors.black
    )

    organizes_style = ParagraphStyle(
        'OrganizesText',
        parent=styles['Normal'],
        fontName='TimesNewRoman',
        fontSize=9,
        leading=12,
        alignment=1,
        textColor=colors.black
    )

    cisabz_title = ParagraphStyle(
        'CisabzTitle',
        parent=styles['Normal'],
        fontName='TimesNewRoman-Bold',
        fontSize=15,
        leading=19,
        alignment=1,
        textColor=colors.black
    )

    tech_non_tech_title = ParagraphStyle(
        'TechNonTech',
        parent=styles['Normal'],
        fontName='TimesNewRoman-Bold',
        fontSize=11.5,
        leading=15,
        alignment=1,
        textColor=colors.black
    )

    guidelines_sub = ParagraphStyle(
        'GuidelinesSub',
        parent=styles['Normal'],
        fontName='TimesNewRoman-Bold',
        fontSize=10.5,
        leading=14,
        alignment=1,
        textColor=colors.black
    )

    meta_style = ParagraphStyle(
        'MetaStyle',
        parent=styles['Normal'],
        fontName='TimesNewRoman',
        fontSize=10,
        leading=16,
        textColor=colors.black
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='TimesNewRoman-Bold',
        fontSize=11.5,
        leading=16,
        textColor=colors.black
    )

    sub_section_heading = ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Normal'],
        fontName='TimesNewRoman-Bold',
        fontSize=10,
        leading=15,
        leftIndent=15,
        textColor=colors.black
    )

    event_heading = ParagraphStyle(
        'EventHeading',
        parent=styles['Normal'],
        fontName='TimesNewRoman-Bold',
        fontSize=10.5,
        leading=15,
        textColor=colors.black
    )

    bullet_item = ParagraphStyle(
        'BulletItem',
        parent=styles['Normal'],
        fontName='TimesNewRoman-Italic',
        fontSize=9.5,
        leading=14,
        leftIndent=20,
        firstLineIndent=-12,
        textColor=colors.black
    )

    sub_bullet_item = ParagraphStyle(
        'SubBulletItem',
        parent=styles['Normal'],
        fontName='TimesNewRoman-Italic',
        fontSize=9.5,
        leading=14,
        leftIndent=38,
        firstLineIndent=-12,
        textColor=colors.black
    )

    check_item = ParagraphStyle(
        'CheckItem',
        parent=styles['Normal'],
        fontName='TimesNewRoman',
        fontSize=9.5,
        leading=15,
        leftIndent=20,
        firstLineIndent=-14,
        textColor=colors.black
    )

    story = []

    # ================= PAGE 1 =================
    printable_w = A4[0] - 90
    img_h = printable_w * (191 / 1128)
    story.append(Image(HEADER_IMG_PATH, width=printable_w, height=img_h))
    story.append(Spacer(1, 14))

    story.append(Paragraph("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING", dept_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("ORGANIZES", organizes_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("CISABZ-2K26", cisabz_title))
    story.append(Spacer(1, 6))
    story.append(Paragraph("TECHNICAL &amp; NON-TECHNICAL EVENTS", tech_non_tech_title))
    story.append(Paragraph("(GUIDELINES)", guidelines_sub))
    story.append(Spacer(1, 16))

    story.append(Paragraph("<b>Event Name:</b> CISABZ-2K26 (CSE EVENTS)", meta_style))
    story.append(Paragraph("<b>Event Date:</b> 25-09-2026", meta_style))
    story.append(Paragraph("<b>Registration Ends On:</b> 23-09-2026", meta_style))
    story.append(Spacer(1, 16))

    # CONTACT DETAILS
    story.append(Paragraph("<u><b>CONTACT DETAILS:</b></u>", section_heading))
    story.append(Spacer(1, 8))

    story.append(Paragraph("<u><b>Student Coordinators:</b></u>", sub_section_heading))
    story.append(Spacer(1, 4))
    story.append(Paragraph("• &nbsp;<b>M MUBASHIR</b> &nbsp;– &nbsp;95143 59887", bullet_item))
    story.append(Paragraph("• &nbsp;<b>C VIGNESH</b> &nbsp;– &nbsp;7871630097", bullet_item))
    story.append(Spacer(1, 12))

    story.append(Paragraph("<u><b>Staff Coordinators:</b></u>", sub_section_heading))
    story.append(Spacer(1, 4))
    story.append(Paragraph("• &nbsp;<b>Ms. B.BAVITHRA</b>, Asst. Prof., CSE DEPT– 78452 86608", bullet_item))
    story.append(Paragraph("• &nbsp;<b>Ms.S.ABIKAYIL AARTHI</b> , Asst. Prof., CSE DEPT– 80128 15838", bullet_item))
    story.append(Spacer(1, 16))

    # GENERAL INSTRUCTIONS
    story.append(Paragraph("<u><b>GENERAL INSTRUCTIONS</b></u>", section_heading))
    story.append(Spacer(1, 8))

    gen_instructions = [
        "Participation is open for single or team entries (team size: up to 2 members).",
        "Each participant is requested to register for a maximum of 2 events — 1 Technical + 1 Non-Technical.",
        "An additional event (beyond the permitted 2) can be added for <font name=\"Georgia\">₹</font>50 per event (ONLY ON THE SPOT).",
        "Every event will be conducted in 2 or 3 level rounds.",
        "ID card &amp; Bonafide certificates are mandatory.",
        "The decision of the Judges will be final.",
        "Participants should be in formal dress code and maintain discipline during the events.",
        "Certificates will be given for all the participants.",
        "Lunch &amp; Refreshments will be provided for all the participants."
    ]

    for item in gen_instructions:
        story.append(Paragraph(f"<font name=\"Times-Roman\">&#10003;</font> &nbsp;{item}", check_item))
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # ================= PAGE 2 =================
    story.append(Paragraph("<u><b>TECHNICAL EVENTS</b></u>", section_heading))
    story.append(Spacer(1, 14))

    # TechVerse
    story.append(Paragraph("<b>TechVerse (Paper Presentation)</b>", event_heading))
    story.append(Spacer(1, 4))
    tv_bullets = [
        "Single round event.",
        "Team size: individual or up to 3 members.",
        "Participants present an innovative idea via PPT.",
        "Maximum of 6–7 slides only allowed.",
        "Demo or working models are appreciated (not mandatory) to support the idea.",
        "Time allotted: up to 5 minutes per team to present.",
        "Topics must be relevant to current technology/innovation trends.",
        "Evaluation criteria:"
    ]
    for b in tv_bullets:
        story.append(Paragraph(f"• &nbsp;{b}", bullet_item))
        story.append(Spacer(1, 3))

    tv_eval = [
        "Originality",
        "Technical depth / feasibility",
        "Clarity of presentation",
        "Quality of demo (if presented) &amp; Q/A session"
    ]
    for ev in tv_eval:
        story.append(Paragraph(f"<font name=\"Times-Roman\">&#10146;</font> &nbsp;{ev}", sub_bullet_item))
        story.append(Spacer(1, 3))
    story.append(Spacer(1, 12))

    # Tech Brainiac
    story.append(Paragraph("<b>Tech Brainiac (Technical Quiz)</b>", event_heading))
    story.append(Spacer(1, 4))
    tb_bullets = [
        "Conducted in 2–3 level rounds (e.g., Prelims <font name=\"Times-Roman\">&rarr;</font> Rapid Fire <font name=\"Times-Roman\">&rarr;</font> Final).",
        "Individual or team participation (up to 3 members).",
        "Questions cover emerging technologies, CS fundamentals, and current tech trends.",
        "Rapid-fire format for later rounds — fastest correct answer scores.",
        "Teams/individuals are shortlisted between rounds based on score."
    ]
    for b in tb_bullets:
        story.append(Paragraph(f"• &nbsp;{b}", bullet_item))
        story.append(Spacer(1, 3))
    story.append(Spacer(1, 12))

    # Prompt Fusion
    story.append(Paragraph("<b>Prompt Fusion (AI Prompt Challenge)</b>", event_heading))
    story.append(Spacer(1, 4))
    pf_bullets = [
        "Conducted in 2 rounds.",
        "Round 1: Recreate a given poster/banner using AI.",
        "Round 2: Recreate a given image and generate a video from it. (image will be given in spot)",
        "Use any AI tool; accounts and credits are the team's responsibility.",
        "One system will be provided per team.",
        "Teams must write their own prompts during the event.",
        "Complete all tasks within the given time limit.",
        "Evaluation criteria:"
    ]
    for b in pf_bullets:
        story.append(Paragraph(f"• &nbsp;{b}", bullet_item))
        story.append(Spacer(1, 3))

    pf_eval = [
        "Prompt Quality",
        "Output Accuracy",
        "Creativity &amp; Visual Quality",
        "Video Quality",
        "Time Management"
    ]
    for ev in pf_eval:
        story.append(Paragraph(f"<font name=\"Times-Roman\">&#10146;</font> &nbsp;{ev}", sub_bullet_item))
        story.append(Spacer(1, 3))
    story.append(Spacer(1, 12))

    # Bug Bash
    story.append(Paragraph("<b>Bug Bash (Debugging)</b>", event_heading))
    story.append(Spacer(1, 4))
    bb_bullets = [
        "Conducted in 2–3 level rounds (e.g., Prelims <font name=\"Times-Roman\">&rarr;</font> Rapid Fire <font name=\"Times-Roman\">&rarr;</font> Final).",
        "Individual or team participation (up to 2 members).",
        "Questions cover emerging technologies, CS fundamentals, and current tech trends.",
        "Rapid-fire format for later rounds — fastest correct answer scores.",
        "Teams/individuals are shortlisted between rounds based on score."
    ]
    for b in bb_bullets:
        story.append(Paragraph(f"• &nbsp;{b}", bullet_item))
        story.append(Spacer(1, 3))

    story.append(PageBreak())

    # ================= PAGE 3 =================
    story.append(Paragraph("<u><b>NON-TECHNICAL EVENTS</b></u>", section_heading))
    story.append(Spacer(1, 14))

    # Pinpoint
    story.append(Paragraph("<b>Pinpoint</b>", event_heading))
    story.append(Spacer(1, 4))
    pp_bullets = [
        "Conducted in 2–3 level rounds.",
        "Individual or team participation (up to 2 members).",
        "A hidden category/word must be guessed from 5 clue words revealed one at a time — fewer clues used means more points.",
        "Faster and more accurate guesses earn higher scores; rounds get progressively harder."
    ]
    for b in pp_bullets:
        story.append(Paragraph(f"• &nbsp;{b}", bullet_item))
        story.append(Spacer(1, 3))
    story.append(Spacer(1, 12))

    # Brand spot
    story.append(Paragraph("<b>Brand spot (Logo Finding)</b>", event_heading))
    story.append(Spacer(1, 4))
    bs_bullets = [
        "Conducted in 2–3 level rounds.",
        "Individual or team participation (up to 2 members).",
        "Participants are shown partially obscured/blurred/cropped logo images and must identify the brand.",
        "Each round increases in difficulty (e.g., more obscured images or shorter time).",
        "Evaluation based on number of correct identifications and speed."
    ]
    for b in bs_bullets:
        story.append(Paragraph(f"• &nbsp;{b}", bullet_item))
        story.append(Spacer(1, 3))
    story.append(Spacer(1, 12))

    # Hammer Hit
    story.append(Paragraph("<b>Hammer Hit (IPL Auction)</b>", event_heading))
    story.append(Spacer(1, 4))
    hh_bullets = [
        "Single round event.",
        "Team participation (up to 4 members per team).",
        "Each team is given a fixed virtual budget to bid on players in a mock IPL-style auction.",
        "Teams take turns bidding; highest bid wins the player.",
        "Winning team decided based on best overall squad value/strategy."
    ]
    for b in hh_bullets:
        story.append(Paragraph(f"• &nbsp;{b}", bullet_item))
        story.append(Spacer(1, 3))
    story.append(Spacer(1, 12))

    # Connection
    story.append(Paragraph("<b>Connection (Link &amp; Think)</b>", event_heading))
    story.append(Spacer(1, 4))
    cn_bullets = [
        "Conducted in 2–3 level rounds.",
        "Individual or team participation (up to 2 members).",
        "Participants are shown a set of images; they must identify the word/concept behind each image and find the common connection linking them.",
        "Difficulty and number of images increase across rounds.",
        "Evaluation based on accuracy and speed of finding the connection."
    ]
    for b in cn_bullets:
        story.append(Paragraph(f"• &nbsp;{b}", bullet_item))
        story.append(Spacer(1, 3))

    doc.build(story, canvasmaker=BorderedCanvas)

if __name__ == '__main__':
    build_pdf_file(OUTPUT_PDF_1)
    build_pdf_file(OUTPUT_PDF_2)
    build_pdf_file(OUTPUT_PDF_3)
    print("Successfully built PDF files with original Times New Roman font")
