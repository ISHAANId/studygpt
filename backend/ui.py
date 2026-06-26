import tkinter as tk
from tkinter import filedialog, scrolledtext
import threading

from load_pdf import load_pdf_text
from embed_store import split_text, create_vector_store
from chatbot import get_answer

vector_store = None


# ---------------- LOAD PDF ---------------- #
def load_pdf():
    threading.Thread(target=process_pdf).start()


def process_pdf():
    global vector_store

    file_path = filedialog.askopenfilename(
        filetypes=[("PDF Files", "*.pdf")]
    )

    if not file_path:
        return

    load_btn.config(state="disabled")
    status_label.config(text="📖 Loading PDF...")

    try:
        text = load_pdf_text(file_path)
        chunks = split_text(text)
        vector_store = create_vector_store(chunks)

        status_label.config(text="✨ Notes loaded successfully!")

    except Exception as e:
        status_label.config(text=f"Error: {str(e)}")

    load_btn.config(state="normal")


# ---------------- ASK QUESTION ---------------- #
def ask_question():
    threading.Thread(target=process_question).start()


def process_question():
    global vector_store

    if vector_store is None:
        chat_box.insert(tk.END, "\n🤖 Load notes first.\n")
        return

    question = question_entry.get().strip()

    if not question:
        return

    question_entry.delete(0, tk.END)

    ask_btn.config(state="disabled")
    status_label.config(text="🤔 Thinking...")

    chat_box.insert(tk.END, f"\n🩷 You:\n{question}\n")
    chat_box.see(tk.END)

    try:
        answer = get_answer(vector_store, question)

        chat_box.insert(
            tk.END,
            f"\n🤖 StudyGPT:\n{answer}\n"
        )

    except Exception as e:
        chat_box.insert(
            tk.END,
            f"\n❌ Error:\n{str(e)}\n"
        )

    status_label.config(text="✨ Ready")
    ask_btn.config(state="normal")
    chat_box.see(tk.END)


def enter_pressed(event):
    ask_question()


# ---------------- UI ---------------- #
root = tk.Tk()
root.title("🌸 StudyGPT")
root.geometry("950x700")
root.configure(bg="#FDE2E4")

title = tk.Label(
    root,
    text="🌸 StudyGPT 🌸",
    font=("Comic Sans MS", 28, "bold"),
    bg="#FDE2E4",
    fg="#D63384"
)
title.pack(pady=15)

load_btn = tk.Button(
    root,
    text="📖 Load Notes",
    command=load_pdf,
    font=("Arial", 14, "bold"),
    bg="#FFB3C6",
    padx=15,
    pady=8
)
load_btn.pack()

status_label = tk.Label(
    root,
    text="Upload notes to begin ✨",
    bg="#FDE2E4",
    fg="#444",
    font=("Arial", 11)
)
status_label.pack(pady=8)

chat_box = scrolledtext.ScrolledText(
    root,
    width=95,
    height=24,
    wrap=tk.WORD,
    font=("Arial", 12),
    padx=15,
    pady=15
)
chat_box.pack(pady=15)

bottom_frame = tk.Frame(root, bg="#FDE2E4")
bottom_frame.pack()

question_entry = tk.Entry(
    bottom_frame,
    width=65,
    font=("Arial", 14)
)
question_entry.grid(row=0, column=0, padx=10)
question_entry.bind("<Return>", enter_pressed)

ask_btn = tk.Button(
    bottom_frame,
    text="💖 Ask",
    command=ask_question,
    font=("Arial", 13, "bold"),
    bg="#FF69B4",
    fg="white",
    padx=15,
    pady=5
)
ask_btn.grid(row=0, column=1)

root.mainloop()