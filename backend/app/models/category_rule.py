import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

from app.models.category import Category


class CategoryRule(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "category_rule"

    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("category.id"),
        nullable=False,
    )
    rule_type: Mapped[str] = mapped_column(String, nullable=False)
    pattern: Mapped[str] = mapped_column(String, nullable=False)
    priority: Mapped[int] = mapped_column(Integer, default=0)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    source: Mapped[str] = mapped_column(String, default="manual")

    category: Mapped["Category"] = relationship(
        "Category",
        back_populates="rules",
    )
