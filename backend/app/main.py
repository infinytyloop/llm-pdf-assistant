from fastapi import FastAPI, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from .file_processing import extract_text
from .llm_integration import get_explanation
import os

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "active", "version": "0.1"}

@app.post("/upload/")
async def upload_file(file: UploadFile):
    if not file.filename:
        raise HTTPException(400, "No file uploaded")
    
    if file.content_type not in ["application/pdf", 
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(400, "Invalid file format. Only PDF/DOCX allowed")
    
    content = await extract_text(file)
    return {"filename": file.filename, "content": content[:5000] + "..."}  # Return partial content

@app.post("/request-explanation/")
async def request_explanation(payload: dict = Body(...)):

    explanation = await get_explanation(payload)
    return {"explanation": explanation}