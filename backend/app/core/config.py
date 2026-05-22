from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # 应用基础配置
    APP_NAME: str = "FinAtlas"
    DEBUG: bool = False

    # 数据库
    DATABASE_URL: str = "postgresql+asyncpg://finatlas:finatlas@localhost:5432/finatlas"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # RabbitMQ / Taskiq
    RABBITMQ_URL: str = "amqp://guest:guest@localhost:5672"

    # Cloudflare R2 对象存储
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    R2_BUCKET_NAME: str = "finatlas"
    R2_PUBLIC_URL: str = ""

    # JWT 认证
    JWT_SECRET: str = "dev-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 小时

    # 管理员默认账号
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD_HASH: str = ""

    # CORS 允许来源
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # LLM / AI Provider（可选，未配置时 AI 功能降级）
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"

    @property
    def r2_endpoint_url(self) -> str:
        return f"https://{self.R2_ACCOUNT_ID}.r2.cloudflarestorage.com"


settings = Settings()
