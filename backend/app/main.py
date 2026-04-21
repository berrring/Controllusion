from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from .api import router
from .config import settings
from .database import Base, SessionLocal, engine
from .seed import seed_demo_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_demo_data(db)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins or ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


def build_error_response(message: str, status_code: int, request: Request, errors: dict | None = None):
    return JSONResponse(
        status_code=status_code,
        content={
            "message": message,
            "success": False,
            "path": request.url.path,
            "errors": errors,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    field_errors: dict[str, str] = {}
    for error in exc.errors():
        location = error.get("loc", [])
        if not location:
            continue
        field_name = str(location[-1])
        field_errors[field_name] = error.get("msg", "Invalid value.")

    message = next(iter(field_errors.values()), "Invalid request payload.")
    return build_error_response(message, status.HTTP_422_UNPROCESSABLE_ENTITY, request, field_errors)


@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    return build_error_response("A record with this value already exists.", status.HTTP_409_CONFLICT, request)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    if hasattr(exc, "status_code") and hasattr(exc, "detail"):
        return build_error_response(str(exc.detail), exc.status_code, request)
    return build_error_response("Internal server error.", status.HTTP_500_INTERNAL_SERVER_ERROR, request)


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(router)
