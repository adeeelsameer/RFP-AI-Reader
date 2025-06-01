from flask import Flask, request, jsonify
from flask_cors import CORS
# import pdfplumber
import os

from langchain_community.document_loaders import PyPDFDirectoryLoader

from get_embedding_function import get_embedding_function

from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_chroma import Chroma

import shutil

from query_data import query_rag

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

CHROMA_PATH = "chroma"
DATA_PATH = "data"

def parse_text_from_file(filepath):

    # USE ANOTHER METHOD TO PARSE THE TEXT FROM THE PDF FILE

    # results = [] #all data from the pdf is stored in this list
    # with pdfplumber.open(filepath) as pdf:
    #     for i, page in enumerate(pdf.pages, start=1):
    #         page_data = {
    #             "source": filepath,
    #             "page_number": i,
    #             "text": page.extract_text(),
    #             "tables": page.extract_tables()
    #         }
    #         results.append(page_data)
    #     print(results[0])
    #     split_text(results)  # Example usage of split_text function

    documents = load_documents()
    chunks = split_documents(documents)
    add_to_chroma(chunks)


def load_documents():
    document_loader = PyPDFDirectoryLoader(UPLOAD_FOLDER)
    return document_loader.load()

def split_documents(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    return text_splitter.split_documents(documents)

# Uncomment the following function if you want to split text directly using the other splitting method

# def split_text(text):
#     text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
#     return text_splitter.split_text(text)

def add_to_chroma(chunks):
    db = Chroma(
        embedding_function=get_embedding_function(),
        persist_directory=CHROMA_PATH
    )

    chunks_with_ids = calculate_chunk_ids(chunks)

    existing_items = db.get(include=[])
    existing_ids = set(existing_items["ids"])
    print(f"Number of existing documents in DB: {len(existing_ids)}")

    new_chunks = []
    for chunk in chunks_with_ids:
        if chunk.metadata["id"] not in existing_ids:
            new_chunks.append(chunk)

    if len(new_chunks):
        print(f"Adding new documents: {len(new_chunks)}")
        new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
        db.add_documents(new_chunks, ids=new_chunk_ids)
    else:
        print("No new documents to add")

def calculate_chunk_ids(chunks):

    # create IDs like "source:page:chunk_index"
    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"

        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id

        chunk.metadata["id"] = chunk_id

    return chunks

def clear_database():
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

def clear_upload_folder():
    if os.path.exists(UPLOAD_FOLDER):
        shutil.rmtree(UPLOAD_FOLDER)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    clear_upload_folder()

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Parse the file that was uploaded
    parse_text_from_file(filepath)

    return jsonify({"message": "File uploaded and parsed successfully"}), 200

@app.route("/questions", methods=["POST"])
def questions():
    data = request.get_json()
    if not data or "question" not in data:
        return jsonify({"error": "No questions provided"}), 400

    question_text = data["question"]
    response = query_rag(question_text)

    return jsonify({"answer": response}), 200

if __name__ == '__main__':
    app.run(debug=True)
