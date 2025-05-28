from langchain_openai import OpenAIEmbeddings
import os
import getpass

def get_embedding_function():
    if not os.environ.get("OPENAI_API_KEY"):
        os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")
    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    return embeddings