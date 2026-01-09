"""
FastAPI Hello World Application
"""

from fastapi import FastAPI

app = FastAPI(title="Hello World API", version="1.0.0")


@app.get("/")
async def root():
    """Root endpoint returning hello world message."""
    return {"message": "Hello World"}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}
