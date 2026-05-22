import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import BigInteger, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.account import Account
    from app.models.import_item import ImportItem


class ImportJob(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "import_job"
    __table_args__ = (
        Index("idx_import_job_account_period", "account_id", "period"),
        Index("idx_import_job_status", "status"),
    )

    account_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("account.id"),
        nullable=False,
    )
    source_type: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    period: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="uploaded")
    file_key: Mapped[str] = mapped_column(String, nullable=False)
    file_hash: Mapped[str] = mapped_column(String, nullable=False)
    content_type: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    file_size: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    retry_count: Mapped[int] = mapped_column(Integer, default=0)
    last_error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    account: Mapped["Account"] = relationship(
        "Account",
        back_populates="import_jobs",
    )
    import_items: Mapped[List["ImportItem"]] = relationship(
        "ImportItem",
        back_populates="import_job",
    )
