import os
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

import streamlit as st
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

st.set_page_config(
    page_title="StudyGPT",
    page_icon="🌸",
    layout="wide"
)

# ---------------- SESSION ----------------
defaults = {
    "notes_text": "",
    "vector_store": None,
    "messages": [],
    "topics": [],
    "selected_topic": None,
    "current_lesson": "",
    "progress": {},
    "quiz_mode": "Flashcards"
}

for k, v in defaults.items():
    if k not in st.session_state:
        st.session_state[k] = v


# ---------------- CSS ----------------
st.markdown("""
<style>
#MainMenu {visibility:hidden;}
footer {visibility:hidden;}
header {visibility:hidden;}

.stApp{
    background:#f7f2ef;
}

/* SIDEBAR */
section[data-testid="stSidebar"]{
    background: linear-gradient(180deg,#2B060D,#45151B);
    width: 290px !important;
}

section[data-testid="stSidebar"] *{
    color: white !important;
}

/* HERO */
.hero{
    background:white;
    padding:20px 10px 25px 10px;
    border-radius:20px;
    margin-bottom:20px;
}

/* CARDS */
.card{
    background:white;
    padding:25px;
    border-radius:22px;
    box-shadow:0 6px 22px rgba(0,0,0,0.08);
    border:1px solid #f0e8e5;
    margin-bottom:20px;
}

.metric{
    background:#fff8f3;
    padding:24px;
    border-radius:20px;
    box-shadow:0 4px 18px rgba(0,0,0,0.06);
    border:1px solid #f4ece7;
}

/* CHAT */
.user-msg{
    background:#ffe7ea;
    padding:16px;
    border-radius:18px;
    margin:12px 0 12px auto;
    width:fit-content;
    max-width:75%;
}

.bot-msg{
    background:#f7f3f1;
    padding:16px;
    border-radius:18px;
    margin:12px 0;
    width:fit-content;
    max-width:75%;
}

/* BUTTONS */
.stButton > button{
    width:100%;
    height:48px;
    border:none;
    border-radius:14px;
    background:#d95c75;
    color:white;
    font-weight:600;
}

.stButton > button:hover{
    background:#c94b65;
}

/* INPUTS */
input, textarea{
    border-radius:14px !important;
}
</style>
""", unsafe_allow_html=True)


# ---------------- HELPERS ----------------
def page_header(title, subtitle=""):
    st.markdown(f"""
    <div class="hero">
        <h1 style="color:#45151B;margin-bottom:6px;">{title}</h1>
        <p style="color:#8c6f68;font-size:20px;">{subtitle}</p>
    </div>
    """, unsafe_allow_html=True)


def open_card():
    st.markdown("<div class='card'>", unsafe_allow_html=True)


def close_card():
    st.markdown("</div>", unsafe_allow_html=True)


# ---------------- SIDEBAR ----------------
with st.sidebar:
    st.markdown("""
    <h1 style='font-size:40px;'>🌸 StudyGPT</h1>
    <p style='color:#f3d9cf;'>Your AI Study Companion</p>
    <hr>
    """, unsafe_allow_html=True)

    page = st.radio(
        "Navigation",
        [
            "💬 Chat",
            "🧠 Tutor",
            "📝 Quiz",
            "📊 Progress",
            "🔗 Resources",
            "🎙 Voice Tutor"
        ]
    )

    uploaded_file = st.file_uploader(
        "Upload Notes PDF",
        type=["pdf"]
    )

    if uploaded_file:
        with open("temp.pdf", "wb") as f:
            f.write(uploaded_file.read())

        with st.spinner("Loading notes..."):
            text = load_pdf_text("temp.pdf")
            st.session_state.notes_text = text
            st.session_state.vector_store = None
            st.session_state.topics = []

        st.success("Notes Loaded")
# ---------------- HERO DASHBOARD ----------------
page_header("Welcome back, Ishaani ✨", "What would you like to learn today?")

c1, c2, c3 = st.columns(3)

with c1:
    st.markdown("""
    <div class='metric'>
        <h4>Topics Learned</h4>
        <h1>18</h1>
    </div>
    """, unsafe_allow_html=True)

with c2:
    st.markdown("""
    <div class='metric'>
        <h4>Quiz Accuracy</h4>
        <h1>82%</h1>
    </div>
    """, unsafe_allow_html=True)

with c3:
    streak = len(st.session_state.progress) if st.session_state.progress else 7
    st.markdown(f"""
    <div class='metric'>
        <h4>Study Streak</h4>
        <h1>{streak} days</h1>
    </div>
    """, unsafe_allow_html=True)

st.write("")


# ================= CHAT =================
if page == "💬 Chat":
    left, right = st.columns([2, 1])

    with left:
        open_card()
        st.subheader("💬 Chat with StudyGPT")

        if st.session_state.notes_text and st.session_state.vector_store is None:
            with st.spinner("Preparing AI search..."):
                chunks = split_text(st.session_state.notes_text)
                st.session_state.vector_store = create_vector_store(chunks)

        question = st.chat_input("Ask anything from your notes...")

        if question:
            st.session_state.messages.append(("user", question))

            if st.session_state.vector_store is None:
                answer = "Please upload notes first."
            else:
                with st.spinner("Thinking..."):
                    answer = get_answer(
                        st.session_state.vector_store,
                        question
                    )

            st.session_state.messages.append(("bot", answer))

        for role, msg in st.session_state.messages:
            if role == "user":
                st.markdown(
                    f"<div class='user-msg'>{msg}</div>",
                    unsafe_allow_html=True
                )
            else:
                st.markdown(
                    f"<div class='bot-msg'>{msg}</div>",
                    unsafe_allow_html=True
                )

        close_card()

    with right:
        open_card()
        st.subheader("Continue Learning")
        st.write("📘 Linear Algebra")
        st.progress(65)
        st.write("65% complete")
        close_card()

        open_card()
        st.subheader("Quick Actions")
        st.button("Generate Quiz")
        st.button("Ask Doubt")
        st.button("Upload Notes")
        close_card()


# ================= TUTOR =================
elif page == "🧠 Tutor":
    page_header(
        "Tutor Mode 🧠",
        "Learn topic-by-topic with AI guidance"
    )

    if not st.session_state.notes_text:
        st.warning("Upload notes first.")
    else:
        if not st.session_state.topics:
            with st.spinner("Creating learning path..."):
                st.session_state.topics = extract_topics(
                    st.session_state.notes_text
                )

        open_card()
        st.subheader("Learning Path")

        cols = st.columns(2)

        for i, topic in enumerate(st.session_state.topics):
            if cols[i % 2].button(topic):
                st.session_state.selected_topic = topic
                st.session_state.current_lesson = ""

        close_card()

        if st.session_state.selected_topic:
            topic = st.session_state.selected_topic

            open_card()
            st.subheader(f"📘 {topic}")

            if st.session_state.current_lesson == "":
                with st.spinner("Teaching topic..."):
                    lesson = teach_topic(
                        topic,
                        st.session_state.notes_text
                    )
                    st.session_state.current_lesson = lesson

            st.write(st.session_state.current_lesson)

            doubt = st.text_input("Ask a doubt")

            if st.button("Ask Doubt"):
                with st.spinner("Thinking..."):
                    doubt_answer = answer_doubt(
                        topic,
                        st.session_state.current_lesson,
                        doubt
                    )
                st.success(doubt_answer)

            close_card()


# ================= QUIZ =================
elif page == "📝 Quiz":
    page_header(
        "Quiz Center 📝",
        "Test your understanding"
    )

    if st.session_state.selected_topic is None:
        st.warning("Select a topic in Tutor mode first.")
    else:
        topic = st.session_state.selected_topic

        c1, c2, c3, c4, c5 = st.columns(5)

        if c1.button("Flashcard"):
            st.session_state.quiz_mode = "Flashcards"
        if c2.button("MCQ"):
            st.session_state.quiz_mode = "MCQ"
        if c3.button("Short"):
            st.session_state.quiz_mode = "Short"
        if c4.button("Long"):
            st.session_state.quiz_mode = "Long"
        if c5.button("Rapid"):
            st.session_state.quiz_mode = "Rapid"

        quiz_type = st.session_state.quiz_mode

        open_card()

        if quiz_type == "Flashcards":
            if st.button("Generate Flashcard"):
                q, a = generate_flashcard(
                    topic,
                    st.session_state.notes_text
                )
                st.session_state.flash_q = q
                st.session_state.flash_a = a

            if "flash_q" in st.session_state:
                st.subheader(st.session_state.flash_q)

                if st.button("Reveal Answer"):
                    st.success(st.session_state.flash_a)

        elif quiz_type == "MCQ":
            if st.button("Generate MCQ"):
                st.session_state.mcq = generate_mcq(
                    topic,
                    st.session_state.notes_text
                )

            if "mcq" in st.session_state:
                st.write(st.session_state.mcq)

        elif quiz_type == "Short":
            question = generate_short_question(topic)
            st.subheader(question)

            ans = st.text_area("Your Answer")

            if st.button("Submit"):
                result = evaluate_answer(question, ans)
                st.success(result)

        elif quiz_type == "Long":
            question = generate_long_question(topic)
            st.subheader(question)

            ans = st.text_area("Detailed Answer", height=200)

            if st.button("Submit Long Answer"):
                result = evaluate_answer(question, ans)
                st.success(result)

        elif quiz_type == "Rapid":
            if st.button("Start Rapid Fire"):
                st.session_state.rapid_q = generate_rapid_fire(topic)

            if "rapid_q" in st.session_state:
                st.subheader(st.session_state.rapid_q)
                ans = st.text_input("Quick Answer")

                if st.button("Submit Rapid"):
                    result = evaluate_answer(
                        st.session_state.rapid_q,
                        ans
                    )
                    st.success(result)

        close_card()
# ================= PROGRESS =================
elif page == "📊 Progress":
    page_header(
        "Progress Dashboard 📊",
        "Track your learning journey"
    )

    if not st.session_state.progress:
        st.info("No progress yet. Complete quizzes to track performance.")
    else:
        c1, c2, c3 = st.columns(3)

        avg_score = (
            sum(st.session_state.progress.values()) /
            len(st.session_state.progress)
        )

        with c1:
            st.markdown(f"""
            <div class='metric'>
                <h4>Topics Completed</h4>
                <h1>{len(st.session_state.progress)}</h1>
            </div>
            """, unsafe_allow_html=True)

        with c2:
            st.markdown(f"""
            <div class='metric'>
                <h4>Average Score</h4>
                <h1>{avg_score:.0f}%</h1>
            </div>
            """, unsafe_allow_html=True)

        with c3:
            st.markdown("""
            <div class='metric'>
                <h4>Level</h4>
                <h1>4</h1>
            </div>
            """, unsafe_allow_html=True)

        st.write("")

        open_card()
        st.subheader("Topic Progress")

        for topic, score in st.session_state.progress.items():
            st.write(f"**{topic}**")
            st.progress(score / 100)
            st.write(f"{score}%")
            st.write("")

        close_card()


# ================= RESOURCES =================
elif page == "🔗 Resources":
    page_header(
        "Learning Resources 🔗",
        "Curated materials for deeper learning"
    )

    if st.session_state.selected_topic is None:
        st.warning("Select a topic in Tutor mode first.")
    else:
        topic = st.session_state.selected_topic

        c1, c2 = st.columns(2)

        with c1:
            open_card()
            st.subheader("🎥 YouTube")
            st.write(
                f"https://www.youtube.com/results?search_query={topic}"
            )
            close_card()

        with c2:
            open_card()
            st.subheader("📄 Articles")
            st.write(
                f"https://www.google.com/search?q={topic}+tutorial"
            )
            close_card()

        open_card()
        st.subheader("📝 Previous Year Questions")
        st.write(
            f"https://www.google.com/search?q={topic}+previous+year+questions"
        )
        close_card()


# ================= VOICE TUTOR =================
elif page == "🎙 Voice Tutor":
    page_header(
        "Voice Tutor 🎙",
        "Speak with your AI tutor"
    )

    open_card()

    st.markdown("""
    <h2 style='color:#45151B;'>🎤 Voice Assistant</h2>
    <p style='color:#8c6f68;'>
    Ask questions using voice (demo mode currently uses text input)
    </p>
    """, unsafe_allow_html=True)

    voice_query = st.text_input(
        "Simulated Voice Input",
        placeholder="Explain linear regression simply"
    )

    if st.button("Process Voice Query"):
        if not st.session_state.notes_text:
            st.warning("Upload notes first.")
        else:
            if st.session_state.vector_store is None:
                with st.spinner("Preparing search..."):
                    chunks = split_text(st.session_state.notes_text)
                    st.session_state.vector_store = create_vector_store(chunks)

            with st.spinner("AI responding..."):
                answer = get_answer(
                    st.session_state.vector_store,
                    voice_query
                )

            st.markdown(f"""
            <div class='bot-msg'>
                <b>You said:</b><br>{voice_query}
                <br><br>
                <b>StudyGPT:</b><br>{answer}
            </div>
            """, unsafe_allow_html=True)

    close_card()