from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)


def split_text(text):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=50
    )
    return splitter.split_text(text)


def create_vector_store(chunks):
    return FAISS.from_texts(chunks, embeddings)