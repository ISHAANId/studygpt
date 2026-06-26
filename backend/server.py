import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Import backend logic
from load_pdf import load_pdf_text
from embed_store import split_text, create_vector_store
from chatbot import get_answer
from tutor import extract_topics, teach_topic, answer_doubt
from quiz import (
    generate_flashcard,
    generate_mcq,
    generate_short_question,
    generate_long_question,
    evaluate_answer,
    generate_rapid_fire
)

app = FastAPI(title="StudyGPT Backend")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for session state
class AppState:
    def __init__(self):
        self.notes_text = ""
        self.vector_store = None
        self.topics = []
        self.active_topic = ""
        self.filename = ""

state = AppState()

class QuestionRequest(BaseModel):
    question: str

class DoubtRequest(BaseModel):
    topic: str
    lesson: str
    doubt: str

class TeachRequest(BaseModel):
    topic: str

class EvaluateRequest(BaseModel):
    question: str
    student_answer: str

@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save file temporarily
    temp_path = "temp_uploaded.pdf"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Load text
        text = load_pdf_text(temp_path)
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        state.notes_text = text
        state.filename = file.filename
        
        # Split text and build embeddings
        chunks = split_text(text)
        state.vector_store = create_vector_store(chunks)
        
        # Extract topics
        state.topics = extract_topics(text)
        if state.topics:
            state.active_topic = state.topics[0]
            
        return {
            "status": "success",
            "filename": file.filename,
            "topics": state.topics,
            "message": f"Successfully loaded and analyzed {file.filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: QuestionRequest):
    if not state.vector_store:
        return {"answer": "Please upload a PDF document first so that I can reference its contents for your study session."}
    
    try:
        answer = get_answer(state.vector_store, request.question)
        return {"answer": answer}
    except Exception as e:
        return {"answer": f"Error: {str(e)}"}

@app.post("/api/tutor/teach")
async def teach(request: TeachRequest):
    if not state.notes_text:
        raise HTTPException(status_code=400, detail="Please upload notes first")
    try:
        lesson = teach_topic(request.topic, state.notes_text)
        return {"lesson": lesson}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tutor/doubt")
async def doubt(request: DoubtRequest):
    try:
        answer = answer_doubt(request.topic, request.lesson, request.doubt)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quiz/generate")
async def generate_quiz(topic: str, mode: str):
    try:
        notes = state.notes_text if state.notes_text else "Default vector space definitions."
        if mode == "Flashcard":
            q, a = generate_flashcard(topic, notes)
            return {"question": q, "answer": a}
        elif mode == "MCQ":
            mcq_text = generate_mcq(topic, notes)
            lines = mcq_text.split("\n")
            question = ""
            options = []
            correct = 0
            current_section = "question"
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                if line.lower().startswith("question:"):
                    question = line.split(":", 1)[-1].strip()
                    current_section = "question"
                elif line.lower().startswith("answer:"):
                    ans_val = line.split(":", 1)[-1].strip().upper()
                    if "A" in ans_val: correct = 0
                    elif "B" in ans_val: correct = 1
                    elif "C" in ans_val: correct = 2
                    elif "D" in ans_val: correct = 3
                    current_section = "answer"
                elif line.startswith(("A)", "B)", "C)", "D)", "A.", "B.", "C.", "D.")):
                    opt_val = line[2:].strip()
                    options.append(opt_val)
                elif current_section == "question":
                    if question:
                        question += " " + line
                    else:
                        question = line
            if len(options) < 4:
                options = [
                    "Multiplicative inverse for every vector",
                    "Additive identity (zero vector)",
                    "Additive commutativity",
                    "Distributivity of scalar addition"
                ]
                correct = 0
            if not question:
                question = "Which of the following is NOT a necessary axiom of a Vector Space V?"
            return {"question": question, "options": options, "correct": correct}
        elif mode == "Short":
            q = generate_short_question(topic)
            return {"question": q}
        elif mode == "Long":
            q = generate_long_question(topic)
            return {"question": q}
        elif mode == "Rapid":
            q = generate_rapid_fire(topic)
            return {"question": q}
        else:
            raise HTTPException(status_code=400, detail="Invalid quiz mode")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quiz/evaluate")
async def evaluate(request: EvaluateRequest):
    try:
        feedback = evaluate_answer(request.question, request.student_answer)
        return {"feedback": feedback}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/state")
async def get_state():
    return {
        "notesLoaded": state.vector_store is not None,
        "filename": state.filename,
        "topics": state.topics
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
