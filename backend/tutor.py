import ollama


def extract_topics(full_text):
    prompt = f"""
Extract main topics from these notes.
Return 4-10 topics as numbered list only.

Notes:
{full_text[:6000]}
"""

    try:
        response = ollama.chat(
            model="llama3.2:latest",
            messages=[{"role": "user", "content": prompt}]
        )

        output = response["message"]["content"]

        topics = []
        for line in output.split("\n"):
            line = line.strip()
            if line:
                cleaned = line.lstrip("0123456789.-) ")
                if cleaned:
                    topics.append(cleaned)

        return topics

    except Exception as e:
        return [f"Error: {str(e)}"]


def teach_topic(topic, notes):
    prompt = f"""
Teach topic like study notes.

Topic:
{topic}

Notes:
{notes[:4000]}

Format:
Definition
Explanation
Example
Important Point
"""

    try:
        response = ollama.chat(
            model="llama3.2:latest",
            messages=[{"role": "user", "content": prompt}]
        )
        return response["message"]["content"]

    except Exception as e:
        return f"Error: {str(e)}"


def answer_doubt(topic, lesson, doubt):
    prompt = f"""
Student is learning:
{topic}

Lesson:
{lesson}

Doubt:
{doubt}

Explain clearly.
"""

    try:
        response = ollama.chat(
            model="llama3.2:latest",
            messages=[{"role": "user", "content": prompt}]
        )

        return response["message"]["content"]

    except Exception as e:
        return f"Error: {str(e)}"