import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import Date, DateTime, ForeignKey, Index, Numeric, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDPrimaryKeyMixin


class InvestmentTrade(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "investment_trade"
    __table_args__ = (
        UniqueConstraint(
            "account_id",
            "dedupe_key",
            name="uq_investment_trade_dedupe",
        ),
        Index("idx_investment_trade_application_date", "application_date"),
        Index("idx_investment_trade_confirmation_date", "confirmation_date"),
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
    application_date: Mapped[date] = mapped_column(Date, nullable=False)
    confirmation_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    trade_type: Mapped[str] = mapped_column(String, nullable=False)
    dividend_mode: Mapped[str] = mapped_column(String, default="reinvest")
    amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 2), nullable=True)
    shares: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 6), nullable=True)
    fund_code: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    fund_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    fee_amount: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(18, 2),
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
        back_populates="investment_trades",
    )
    import_job: Mapped["ImportJob"] = relationship("ImportJob")
