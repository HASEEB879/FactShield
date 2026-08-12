from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.verify import router

app = FastAPI(
    title="FactShield API",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {"message": "API Working"}