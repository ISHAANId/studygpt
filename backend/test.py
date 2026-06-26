from load_pdf import load_pdf_text
from tutor import extract_topics, teach_topic

text = load_pdf_text("data/sample.pdf")

topics = extract_topics(text)
print(topics)

lesson = teach_topic(topics[0], text)
print(lesson)