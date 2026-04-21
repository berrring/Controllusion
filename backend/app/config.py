from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_SQLITE_URL = f"sqlite:///{(BASE_DIR / 'controllusion.db').as_posix()}"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "controllusion-backend"
    database_url: str = Field(default=DEFAULT_SQLITE_URL, alias="DATABASE_URL")
    db_url: str | None = Field(default=None, alias="DB_URL")
    jwt_secret: str = Field(
        default="change-this-dev-secret-to-a-long-random-string-at-least-32-characters",
        alias="JWT_SECRET",
    )
    jwt_expiration_minutes: int = Field(default=1440, alias="JWT_EXPIRATION_MINUTES")
    cors_allowed_origins: str = Field(
        default="http://localhost:5173,http://localhost:3000",
        alias="APP_CORS_ALLOWED_ORIGINS",
    )
    invite_temporary_password: str = Field(default="Welcome@123", alias="INVITE_TEMP_PASSWORD")

    @property
    def resolved_database_url(self) -> str:
        return self.db_url or self.database_url

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",") if origin.strip()]


settings = Settings()
