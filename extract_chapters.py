import json
import pathlib
import re

import pdfplumber


CHAPTERS = {
    "familias": {"pdf": "FAMILIAS QUE PERDURAN (1).pdf", "start": 6, "end": 14},
    "hombre-mujer": {"pdf": "El valor de ser hombre y mujer.pdf", "start": 5, "end": 17},
    "comiendo": {"pdf": "Comiendo para vivir en el sigl.pdf", "start": 6, "end": 18},
    "juventud": {"pdf": "GUIA PARA LA JUVENTUD DEL SIGL.pdf", "start": 6, "end": 15},
    "lideres": {"pdf": "Mas que líderes, Siervos.pdf", "start": 6, "end": 15},
}


def clean_page(text, header):
    lines = [line.strip() for line in (text or "").splitlines()]
    cleaned = []
    for line in lines:
        if not line:
            continue
        if line == header:
            continue
        if re.fullmatch(r"\d+", line):
            continue
        cleaned.append(line)
    return "\n".join(cleaned)


def main():
    chapters = {}
    for key, data in CHAPTERS.items():
        with pdfplumber.open(data["pdf"]) as pdf:
            first_text = pdf.pages[data["start"] - 1].extract_text() or ""
            first_lines = first_text.splitlines()
            header = first_lines[0].strip() if first_lines else ""
            pages = []
            for page_number in range(data["start"], data["end"] + 1):
                page_text = pdf.pages[page_number - 1].extract_text()
                pages.append(clean_page(page_text, header))
            text = "\n\n".join(page for page in pages if page.strip())
            text = re.sub(r"\n{3,}", "\n\n", text).strip()
            chapters[key] = text

    output = "window.freeChapters = "
    output += json.dumps(chapters, ensure_ascii=False, indent=2)
    output += ";\n"
    pathlib.Path("chapters.js").write_text(output, encoding="utf-8")

    for key, text in chapters.items():
        first_line = text.splitlines()[0] if text.splitlines() else "(sin texto)"
        print(f"{key}: {len(text)} caracteres - {first_line}")


if __name__ == "__main__":
    main()
