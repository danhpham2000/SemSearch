import hashlib
from typing import Optional
from pydantic import BaseModel

class DocumentResponse(BaseModel):
    page_content: str
    metadata: dict

class DocumentModel(BaseModel):
    page_content: str
    metadata: Optional[dict]

    def generate_digest(self):
        hash_object = hashlib.md5(self.page_content.encode())
        return hash_object.hexdigest()

class SearchRequest(BaseModel):
    query: str