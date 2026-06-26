# StudyGPT — AI-Powered Study Companion

> **Your personal AI tutor that transforms PDF notes into interactive learning experiences.**

---

##  Deployed Link

| Environment | URL |
|---|---|
| **Frontend (Vercel)** | [https://vite-react-ts.vercel.app](https://vite-react-ts.vercel.app) |
| **Backend (Local)** | `http://localhost:8000` (FastAPI dev server) |

> [!NOTE]
> The frontend is deployed on **Vercel** (project: `vite-react-ts`). The backend runs locally via FastAPI/Uvicorn and requires **Ollama** with the `llama3.2:latest` model running on your machine.

---

##  Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | ^19.2.6` | UI library for building component-based interfaces |
| **TypeScript** | ~6.0.2` | Static typing for safer, more maintainable code |
| **Vite** | `^8.0.12` | Lightning-fast build tool & dev server with HMR |
| **Tailwind CSS** | `^4.3.1` | Utility-first CSS framework (v4 with `@tailwindcss/vite` plugin) |
| **React Router DOM** | `^7.18.0` | Client-side routing (SPA navigation) |
| **Framer Motion** | `^12.41.0` | Production-ready animation library for React |
| **Lucide React** | `^1.21.0` | Beautiful open-source icon set |
| **Heroicons** | `^2.2.0` | SVG icons from the makers of Tailwind CSS |

### Backend

| Technology | Purpose |
|---|---|
| **Python 3** | Core backend language |
| **FastAPI** | Modern, high-performance async web framework for the REST API |
| **Uvicorn** | ASGI server to run the FastAPI application |
| **Ollama** | Local LLM inference engine (runs `llama3.2:latest`) |
| **LangChain** | Framework for building LLM-powered applications |
| **LangChain Community** | Community integrations (FAISS vector store, HuggingFace embeddings) |
| **FAISS (CPU)** | Facebook AI Similarity Search — vector database for semantic search |
| **Sentence Transformers** | HuggingFace model (`all-MiniLM-L6-v2`) for text embeddings |
| **PyPDF** | PDF text extraction |
| **SpeechRecognition** | Voice input processing |
| **pyttsx3** | Text-to-speech synthesis |
| **OpenAI Whisper** | Audio transcription (voice tutor feature) |

### Deployment & Tooling

| Technology | Purpose |
|---|---|
| **Vercel** | Frontend hosting & deployment (with SPA rewrites) |
| **ESLint** | Code linting with React-specific plugins |
| **PostCSS + Autoprefixer** | CSS processing pipeline |

### Earlier Prototype

| Technology | Purpose |
|---|---|
| **Streamlit** | Original UI prototype (`web_app.py`) before the React rewrite |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                   FRONTEND (React + TS)              │
│                   Deployed on Vercel                 │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │Dashboard │ │  Chat    │ │  Tutor   │ │  Quiz  │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │ Progress │ │Resources │ │  Voice   │ │Settings│  │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘  │
│                       │                              │
│              fetch() calls to API                    │
└───────────────────────┼──────────────────────────────┘
                        │  HTTP (REST)
┌───────────────────────┼──────────────────────────────┐
│                BACKEND (FastAPI + Python)             │
│                   Runs Locally                       │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │               server.py (FastAPI)               │ │
│  │    /api/upload  /api/chat  /api/tutor/*         │ │
│  │    /api/quiz/*  /api/state                      │ │
│  └──────────┬──────────┬──────────┬────────────────┘ │
│             │          │          │                   │
│  ┌──────────▼┐  ┌──────▼────┐  ┌─▼────────────────┐ │
│  │ load_pdf  │  │ chatbot   │  │    quiz.py        │ │
│  │   .py     │  │   .py     │  │  (5 quiz modes)   │ │
│  └──────────┬┘  └──────┬────┘  └─┬────────────────┘ │
│             │          │         │                   │
│  ┌──────────▼──────────▼─────────▼────────────────┐ │
│  │            embed_store.py                      │ │
│  │  HuggingFace Embeddings → FAISS Vector Store   │ │
│  └──────────────────────┬─────────────────────────┘ │
│                         │                            │
│  ┌──────────────────────▼─────────────────────────┐ │
│  │               Ollama (llama3.2)                │ │
│  │           Local LLM Inference Engine           │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## Features

###  PDF Upload & Processing
- Upload study notes as PDF files
- Automatic text extraction with **PyPDF**
- Text chunking (1500 chars, 50 overlap) via **LangChain**'s `RecursiveCharacterTextSplitter`
- Semantic embeddings using **all-MiniLM-L6-v2** stored in a **FAISS** vector database

###  AI Chat
- Ask questions from your uploaded notes
- RAG (Retrieval-Augmented Generation) pipeline: top-4 similarity search → LLM answer
- Context-aware responses powered by **Ollama (llama3.2)**

### AI Tutor
- Automatic topic extraction from uploaded notes (4–10 topics)
- Structured lesson generation (Definition → Explanation → Example → Key Point)
- Follow-up doubt resolution within the context of the lesson

### Quiz Center (5 Modes)
| Mode | Description |
|---|---|
| **Flashcard** | AI-generated Q&A flashcards with reveal animation |
| **MCQ** | Multiple-choice questions with 4 options |
| **Short Answer** | Brief response questions with AI evaluation |
| **Long Answer** | Detailed essay-style questions with scoring |
| **Rapid Fire** | Timed challenge (10-second countdown) with instant feedback |

###  Progress Tracking
- Visual progress dashboard with statistics
- Topics learned, quiz accuracy, and study streak tracking
- Per-topic progress bars

###  Resources
- Auto-generated YouTube search links for selected topics
- Google search links for tutorials and articles
- Previous year questions search

###  Voice Tutor
- Voice-based interaction with the AI tutor
- Audio transcription via **OpenAI Whisper**
- Text-to-speech responses

###  Settings
- Customizable user preferences

---

##  Project Structure

```
studygpt/
├── 📂 frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx                 # Root component with React Router
│   │   ├── main.tsx                # Entry point
│   │   ├── index.css               # Global styles & Tailwind theme
│   │   ├── App.css                 # App-level styles
│   │   └── components/
│   │       ├── Sidebar.tsx         # Navigation sidebar
│   │       ├── Dashboard.tsx       # Home dashboard
│   │       ├── Chat.tsx            # AI chat interface
│   │       ├── Tutor.tsx           # Topic-based tutor
│   │       ├── Quiz.tsx            # Quiz center (5 modes)
│   │       ├── Progress.tsx        # Learning progress tracker
│   │       ├── Resources.tsx       # External learning resources
│   │       ├── Voice.tsx           # Voice tutor interface
│   │       ├── Settings.tsx        # User settings
│   │       ├── Hero.tsx            # Hero/banner component
│   │       └── StatsCard.tsx       # Statistics card component
│   ├── vercel.json                 # Vercel SPA routing config
│   ├── vite.config.ts              # Vite + React + Tailwind config
│   ├── tsconfig.json               # TypeScript configuration
│   └── package.json                # Frontend dependencies
│
├── 📂 backend/                     # Python FastAPI + Ollama
│   ├── server.py                   # FastAPI REST API server
│   ├── chatbot.py                  # RAG chatbot (Ollama + FAISS)
│   ├── tutor.py                    # AI tutor (topic extraction & teaching)
│   ├── quiz.py                     # Quiz generation (5 modes)
│   ├── load_pdf.py                 # PDF text extraction (PyPDF)
│   ├── embed_store.py              # Text embeddings & FAISS vector store
│   ├── voice_transcriber.py        # Whisper audio transcription
│   ├── web_app.py                  # Streamlit prototype (original UI)
│   ├── app.py                      # CLI-based chatbot interface
│   ├── ui.py                       # Tkinter desktop UI
│   ├── requirements.txt            # Python dependencies
│   └── data/                       # PDF storage directory
│
├── .venv/                          # Python virtual environment
├── README.md                       # This file
└── studygpt.code-workspace         # VS Code workspace config
```

---

##  Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **Ollama** installed and running with `llama3.2:latest` model

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd studygpt
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # macOS/Linux

# Install Python dependencies
pip install -r backend/requirements.txt

# Pull the Ollama model
ollama pull llama3.2:latest

# Start the FastAPI server
cd backend
python server.py
# → Server runs at http://localhost:8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
# → App runs at http://localhost:5173
```

### 4. Environment Variables (Optional)

Create a `.env` file in `frontend/` to point the frontend to a custom API URL:

```env
VITE_API_URL=http://localhost:8000
```

---

##  Design System

The frontend uses a warm, premium color palette defined in Tailwind CSS v4's `@theme`:

| Token | Color | Usage |
|---|---|---|
| `--color-bg` | `#F8F3EF` | Background (warm cream) |
| `--color-primary` | `#45151B` | Primary text & sidebar (deep maroon) |
| `--color-accent1` | `#C74E51` | Primary accent (rose) |
| `--color-accent2` | `#F99256` | Secondary accent (warm orange) |
| `--color-accent3` | `#FBDE9C` | Tertiary accent (soft gold) |

**Typography**: Inter (body) & Poppins (headings)

---

##  API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload a PDF file for processing |
| `POST` | `/api/chat` | Ask a question (RAG pipeline) |
| `POST` | `/api/tutor/teach` | Get a structured lesson on a topic |
| `POST` | `/api/tutor/doubt` | Ask a doubt within a lesson |
| `POST` | `/api/quiz/generate` | Generate a quiz (mode: Flashcard/MCQ/Short/Long/Rapid) |
| `POST` | `/api/quiz/evaluate` | Evaluate a student's answer |
| `GET` | `/api/state` | Get current app state (loaded file, topics) |

---

##  Author

**Ishaani Dongre**

---

##  License

This project is for educational purposes.
