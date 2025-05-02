from pinecone import Pinecone, ServerlessSpec
from langchain_community.document_loaders import PyPDFLoader
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
import os
import time

load_dotenv()

# Initialize all key variables
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
embeddings = OpenAIEmbeddings(model="text-embedding-3-large", api_key=os.getenv("OPENAI_API_KEY"))


# For loading document
def doc_loader(document):
    loader = PyPDFLoader(document)
    docs = loader.load()
    return docs

index_name = "langchain-document-index"

current_indexes = [index_info["name"] for index_info in pc.list_indexes()]

if index_name not in current_indexes:
    pc.create_index(
        name=index_name,
        dimension=3072,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
    while not pc.describe_index(name=index_name):
        time.sleep(1)


index = pc.Index(name=index_name)

pc_vector_store = PineconeVectorStore(index=index, embedding=embeddings)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)

path = "./documents/Danh_Pham_Resume.pdf"

documents = doc_loader(document=path)

new_docs = text_splitter.split_documents(documents)

pc_vector_store.add_documents(new_docs)









