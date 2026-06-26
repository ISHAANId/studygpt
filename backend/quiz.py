import ollama
import random


def generate_flashcard(topic, notes):
    prompt = f"""
Create 1 flashcard for topic: {topic}

Format:
Question:
Answer:

Notes:
{notes[:3000]}
"""

    try:
        response = ollama.chat(
            model="llama3.2:latest",
            messages=[{"role": "user", "content": prompt}]
        )

        text = response["message"]["content"]

        question = "Question not generated"
        answer = "Answer not generated"

        lines = text.split("\n")

        for line in lines:
            if line.lower().startswith("question"):
                question = line.split(":", 1)[-1].strip()
            elif line.lower().startswith("answer"):
                answer = line.split(":", 1)[-1].strip()

        return question, answer

    except Exception as e:
        return f"Error: {str(e)}", ""


def generate_mcq(topic, notes):
    prompt = f"""
Generate 1 MCQ on topic: {topic}

STRICT FORMAT:
Question:
A)
B)
C)
D)
Answer:

Notes:
{notes[:3000]}
"""

    try:
        response = ollama.chat(
            model="llama3.2:latest",
            messages=[{"role": "user", "content": prompt}]
        )

        return response["message"]["content"]

    except Exception as e:
        return f"Error: {str(e)}"


def generate_short_question(topic):
    questions = [
        f"Define {topic}.",
        f"What is the purpose of {topic}?",
        f"Give one example of {topic}.",
        f"Explain {topic} briefly."
    ]
    return random.choice(questions)


def generate_long_question(topic):
    questions = [
        f"Explain {topic} in detail.",
        f"Discuss the working of {topic} with examples.",
        f"Write detailed notes on {topic}."
    ]
    return random.choice(questions)


def evaluate_answer(question, student_answer):
    prompt = f"""
Evaluate student's answer.

Question:
{question}

Student Answer:
{student_answer}

Return:
Score: x/10
Feedback:
Missing Points:
"""

    try:
        response = ollama.chat(
            model="llama3.2:latest",
            messages=[{"role": "user", "content": prompt}]
        )

        return response["message"]["content"]

    except Exception as e:
        return f"Error: {str(e)}"


def generate_rapid_fire(topic):
    questions = [
        f"What is {topic}?",
        f"One use of {topic}?",
        f"Why is {topic} important?",
        f"Give an example of {topic}"
    ]
    return random.choice(questions)