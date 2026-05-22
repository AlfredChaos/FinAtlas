import uuid
from typing import Optional

from sqlalchemy import Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDPrimaryKeyMixin

from app.models.import_job import ImportJob


class ImportItem(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "import_item"

    import_job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("import_job.id"),
        nullable=False,
    )
    pointer: Mapped[str] = mapped_column(String, nullable=False)
    raw_payload: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    normalized_payload: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending")
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    import_job: Mapped["ImportJob"] = relationship(
        "ImportJob",
        back_populates="import_items",
    )
