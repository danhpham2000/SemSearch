from typing import Annotated

from fastapi import FastAPI, Form, File
from fastapi.middleware.cors import CORSMiddleware


from pinecone import Pinecone, ServerlessSpec
from langchain_community.document_loaders import PyPDFLoader
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document
import pinecone_datasets
from dotenv import load_dotenv
import os
import time

from pydantic import BaseModel
from starlette.datastructures import UploadFile

from model import DocumentModel, SearchRequest

load_dotenv()
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
embeddings = OpenAIEmbeddings(model="text-embedding-3-large", api_key=os.getenv("OPENAI_API_KEY"))
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

@app.post("/documents")
async def post_documents(file : DocumentModel):
    doc = Document(page_content=file.content)
    try:
        path = "./documents"
        os.makedirs(path, exist_ok=True)
        file_path = os.path.join(path, file.filename)

        # Save the uploaded file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        loader = PyPDFLoader(file_path)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        documents = text_splitter.split_documents(docs)
        pc_vector_store.add_documents(documents)

        return {"message": f"{file.filename} processed successfully", "num_chunks": len(documents)}
    except Exception as e:
        print(e)
        return {"error": str(e)}




@app.post("/search")
def search_documents(search: SearchRequest):
    print(search.query)
    results = pc_vector_store.similarity_search(search.query, k=3)
    return {"results": results}






