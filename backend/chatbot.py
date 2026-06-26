import ollama


def get_answer(vector_store, query):
    docs = vector_store.similarity_search(query, k=4)
    context = "\n\n".join(doc.page_content for doc in docs)

    prompt = f"""
You are StudyGPT.

Answer like college study notes.

Rules:
- Direct answer
- No chatbot phrases
- Clear explanation
- Concise but useful

Notes:
{context}

Question:
{query}
"""

    try:
        response = ollama.chat(
            model="llama3.2:latest",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return response["message"]["content"]

    except Exception as e:
        return f"Ollama Error: {str(e)}"