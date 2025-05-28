from flask import Flask, request, jsonify
from flask_cors import CORS
# import pdfplumber
import os
from langchain.document_loaders.pdf import PyPDFDirectoryLoader

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
    print(chunks[0])

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

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Parse the file that was uploaded
    parse_text_from_file(filepath)

    return jsonify({"message": "File uploaded and parsed successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
