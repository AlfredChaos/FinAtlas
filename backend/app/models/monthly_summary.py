import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDPrimaryKeyMixin


class MonthlySummary(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "monthly_summary"
    __table_args__ = (
        UniqueConstraint(
            "month",
            "snapshot_version",
            name="uq_monthly_summary_version",
        ),
    )

    month: Mapped[str] = mapped_column(String, nullable=False)
    snapshot_version: Mapped[str] = mapped_column(String, nullable=False)
    summary_payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
    generated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
