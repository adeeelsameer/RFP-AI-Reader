import argparse
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate

from dotenv import load_dotenv
load_dotenv()

from langchain_openai import OpenAI

from get_embedding_function import get_embedding_function
import os
import getpass

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
The following context is extracted from parts of a company's RFP to give you context since it is a large document. Use it to answer the question as accurately as possible. Make sure you know the company's name and the things they do, as well as the products and services they offer. If you don't know the answer, say "Sorry, the given RFP does not have enough information for me to answer this question." instead of making up an answer. Answer like you are giving a response to a customer and you know very well about the company and this RFP.

Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

def query_rag(query_text: str):
    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    results = db.similarity_search_with_score(query_text, k=5)

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)

    if "OPENAI_API_KEY" not in os.environ:
        os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")

    llm = OpenAI()
    response = llm.invoke(prompt)

    sources = [doc.metadata.get("id", None) for doc, _score in results]
    formatted_response = f"Response: {response}\nSources: {sources}"
    print(formatted_response)
    return response