from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def parse_text_from_file(filepath):
    results = [] #all data from the pdf is stored in this list
    with pdfplumber.open(filepath) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            page_data = {
                "source": filepath,
                "page_number": i,
                "text": page.extract_text(),
                "tables": page.extract_tables()
            }
            results.append(page_data)
        print(results[0])

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
