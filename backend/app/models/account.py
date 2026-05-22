import uuid
from typing import TYPE_CHECKING, List

from sqlalchemy import Boolean, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.import_job import ImportJob
    from app.models.investment_trade import InvestmentTrade
    from app.models.transaction import Transaction


class Account(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "account"

    name: Mapped[str] = mapped_column(String, nullable=False)
    source_type: Mapped[str] = mapped_column(String, nullable=False)
    account_type: Mapped[str] = mapped_column(String, nullable=False)
    settings: Mapped[dict] = mapped_column(JSONB, default=dict)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)

    import_jobs: Mapped[List["ImportJob"]] = relationship(
        "ImportJob",
        back_populates="account",
    )
    transactions: Mapped[List["Transaction"]] = relationship(
        "Transaction",
        back_populates="account",
    )
    investment_trades: Mapped[List["InvestmentTrade"]] = relationship(
        "InvestmentTrade",
        back_populates="account",
    )
