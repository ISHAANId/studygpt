import os
from load_pdf import load_pdf_text
from embed_store import split_text, create_vector_store
from chatbot import get_answer


def get_pdf_files(folder="data"):
    pdfs = [f for f in os.listdir(folder) if f.lower().endswith(".pdf")]
    return pdfs


print("📚 StudyGPT Starting...")

# Find PDFs
pdf_files = get_pdf_files()

if not pdf_files:
    print("❌ No PDF files found in the data folder.")
    exit()

# Show available PDFs
print("\nAvailable PDFs:\n")

for i, pdf in enumerate(pdf_files, start=1):
    print(f"{i}. {pdf}")

# Choose PDF
while True:
    try:
        choice = int(input("\nEnter PDF number: "))

        if 1 <= choice <= len(pdf_files):
            break

        print("❌ Invalid choice.")

    except ValueError:
        print("❌ Enter a valid number.")

selected_pdf = os.path.join("data", pdf_files[choice - 1])

print(f"\n📄 Loading: {pdf_files[choice - 1]}")

# Load PDF
text = load_pdf_text(selected_pdf)

if not text.strip():
    print("❌ Could not extract text from PDF.")
    exit()

print("✂️ Splitting text...")
chunks = split_text(text)

print("🧠 Creating vector database...")
vector_store = create_vector_store(chunks)

print("\n✅ StudyGPT is Ready!")
print("Type 'exit' to quit.\n")

# Chat loop
while True:
    query = input("🧑 Ask a question: ")

    if query.lower() == "exit":
        print("👋 Goodbye!")
        break

    answer = get_answer(vector_store, query)

    print("\n🤖 Answer:\n")
    print(answer)
    print("\n" + "-" * 50 + "\n")