"""created_tasks_table

Revision ID: 060234169625
Revises: c4abe50488ca
Create Date: 2026-09-05 16:57:27.100954

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '060234169625'
down_revision: Union[str, Sequence[str], None] = 'c4abe50488ca'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('tasks', 
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('title', sa.String(), nullable=False),
                    sa.Column('description', sa.String(), nullable=False),
                    sa.Column('due_at', sa.DateTime(timezone=True), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.PrimaryKeyConstraint('id'),
                    sa.ForeignKeyConstraint(["user_id"], ["users.id"])
                    )
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('tasks')
    pass
