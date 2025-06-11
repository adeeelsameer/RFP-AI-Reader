# 🧠 RFP AI Reviewer

A Retrieval-Augmented Generation (RAG) web application that allows users to upload large RFP PDF documents and ask questions about the content. It uses a **Flask backend** for processing and **React frontend** for interaction.

> **Developed during a Software Engineering Internship at Mannai InfoTech (May–June 2025)**  
> *Used internally by cross-functional teams to streamline RFP analysis.*

---

## 💡 Key Features

- 📤 Upload large PDF RFP documents
- 🔍 Extract text and chunk it intelligently using `langchain`
- 🧠 Embed document chunks using OpenAI Embeddings
- ⚡ Store and search embeddings with **ChromaDB** for fast semantic search
- 💬 Ask natural language questions and get answers grounded in the actual document content

---

## 🚀 How It Works

1. **Upload PDF**: User uploads an RFP.
2. **Parsing**: The backend loads and splits the PDF into chunks using `langchain` tools.
3. **Embeddings**: Chunks are embedded via `OpenAIEmbeddings` and stored in a local Chroma vector database.
4. **Querying**: User submits a question. The backend fetches the k-most relevant chunks and sends them as context to the OpenAI LLM.
5. **Response**: The model replies with a natural language answer based only on the document content.

---

## ⚙️ Tech Stack

| Layer     | Tools Used                                  |
|-----------|---------------------------------------------|
| Frontend  | React.js                                    |
| Backend   | Flask, Flask-CORS                           |
| NLP/RAG   | LangChain, OpenAI API (GPT + Embeddings)    |
| Database  | Chroma (local vector database)              |
| Parsing   | PyPDF + LangChain's `RecursiveTextSplitter` |
| Environment | dotenv for secure API key management     |

---

## 📁 Folder Structure

```
root/
├── client/ # React frontend
│ └── ... # Frontend source files
├── flask-server/ # Flask backend
│ ├── server.py # Main server application
│ ├── query_data.py # Handles RAG question answering
│ ├── get_embedding_function.py # Embedding utility
│ └── uploads/ # Temp folder for uploaded PDFs
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/adeeelsameer/RFP-AI-Reader.git
cd RFP-AI-Reader
```

### 2. Set Up the Backend

#### i) Install dependencies

```bash
cd flask-server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### ii) Create a .env file with your OpenAI API key:

```env
OPENAI_API_KEY = your_openai_api_key_here
```

#### iii) Run the backend:

```bash
python server.py
```

### 4. Set Up the Frontend

```bash
cd ../client
npm install
npm start # Run the frontend
```
---

## 🧪 How It Works

- PDF Upload: User uploads an RFP document.
- Text Extraction: The backend parses and splits the document into meaningful chunks.
- Embedding & Storage: Each chunk is embedded via OpenAI and stored in ChromaDB.
- Question Answering: User asks questions. The app retrieves top-matching chunks and sends them to an LLM for a grounded response.

---

## 🌐 API Overview

| Endpoint    | Method | Description                            |
|-------------|--------|----------------------------------------|
| `/upload`   | POST   | Upload and process a new PDF           |
| `/questions`| POST   | Ask a question related to uploaded PDF |


---

## 📈 Impact at Mannai InfoTech

- Reduced manual document reading time for RFPs across procurement, technical, and PM teams.
- Integrated into daily operations for proposal review.

---

