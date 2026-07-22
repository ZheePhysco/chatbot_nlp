import re

def clean_paragraph(paragraph):
    paragraph = paragraph.strip()
    paragraph = re.sub(
        r"\s+",
        " ",
        paragraph
    )
    return paragraph

def split_into_chunks(
    text,
    min_length=120
):
    paragraphs = re.split(
        r"\n\s*\n",
        text
    )

    hasil = []
    current = ""
    index = 0

    for p in paragraphs:
        p = clean_paragraph(p)

        if len(p) < 5:
            continue

        if len(current) < min_length:
            current += "\n\n" + p
        else:
            hasil.append({
                "index": index,
                "text": current.strip()
            })
            current = p
            index += 1

    if current:
        hasil.append({
            "index": index,
            "text": current.strip()
        })

    return hasil