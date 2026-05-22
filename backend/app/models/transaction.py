import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, Index, Numeric, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.account import Account
    from app.models.category import Category
    from app.models.import_job import ImportJob


class Transaction(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "transaction"
    __table_args__ = (
        UniqueConstraint(
            "account_id",
            "dedupe_key",
            name="uq_transaction_dedupe",
        ),
        Index("idx_transaction_occurred_at", "occurred_at"),
        Index("idx_transaction_category_id", "category_id"),
    )

    account_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("account.id"),
        nullable=False,
    )
    source_import_job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("import_job.id"),
        nullable=False,
    )
    occurred_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    settlement_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    counterparty: Mapped[str] = mapped_column(String, nullable=False)
    raw_description: Mapped[str] = mapped_column(String, nullable=False)
    category_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("category.id"),
        nullable=True,
    )
    dedupe_key: Mapped[str] = mapped_column(String, nullable=False)
    source_pointer: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    account: Mapped["Account"] = relationship(
        "Account",
        back_populates="transactions",
    )
    import_job: Mapped["ImportJob"] = relationship("ImportJob")
    category: Mapped[Optional["Category"]] = relationship(
        "Category",
        back_populates="transactions",
    )
