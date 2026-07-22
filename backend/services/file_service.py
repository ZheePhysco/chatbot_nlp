import fitz
import docx

def read_pdf(filepath):
    text = ""
    pdf = fitz.open(filepath)
    for page in pdf:
        text += page.get_text()
    return text

def read_docx(filepath):
    text = ""
    document = docx.Document(filepath)
    for para in document.paragraphs:
        text += para.text + "\n"
    return text

def read_txt(filepath):
    with open(
        filepath,
        "r",
        encoding="utf-8"
    ) as file:
        return file.read()