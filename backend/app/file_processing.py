import io
import pdfplumber
from docx import Document

async def extract_text(file):
    content = await file.read()
    
    # Handle PDF
    if file.content_type == "application/pdf":
        try:
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                return "\n".join(page.extract_text() for page in pdf.pages)
        except:
            return "PDF extraction failed"
    
    # Handle DOCX
    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        try:
            doc = Document(io.BytesIO(content))
            return "\n".join(para.text for para in doc.paragraphs)
        except:
            return "DOCX extraction failed"
    
    return "Unsupported file type"