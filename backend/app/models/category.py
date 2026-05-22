import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, ForeignKey, Integer, String, event
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.category_rule import CategoryRule
    from app.models.transaction import Transaction


class Category(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "category"

    parent_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("category.id"),
        nullable=True,
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    budget_group: Mapped[str] = mapped_column(String, nullable=False)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    parent: Mapped[Optional["Category"]] = relationship(
        "Category",
        remote_side="Category.id",
        back_populates="children",
    )
    children: Mapped[List["Category"]] = relationship(
        "Category",
        back_populates="parent",
    )
    rules: Mapped[List["CategoryRule"]] = relationship(
        "CategoryRule",
        back_populates="category",
    )
    transactions: Mapped[List["Transaction"]] = relationship(
        "Transaction",
        back_populates="category",
    )


@event.listens_for(Category, "before_insert")
@event.listens_for(Category, "before_update")
def _validate_parent_not_self(mc, connection, target):
    if target.parent_id is not None and target.parent_id == target.id:
        raise ValueError("Category parent_id cannot reference itself")
