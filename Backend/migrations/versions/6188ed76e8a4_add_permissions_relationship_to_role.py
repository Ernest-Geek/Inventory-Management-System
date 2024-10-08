"""Add permissions relationship to Role

Revision ID: 6188ed76e8a4
Revises: 5c13b3935e4e
Create Date: 2024-09-10 00:02:19.620496

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql
from sqlalchemy.engine.reflection import Inspector

# revision identifiers, used by Alembic.
revision = '6188ed76e8a4'
down_revision = '5c13b3935e4e'
branch_labels = None
depends_on = None


def table_exists(conn, table_name):
    inspector = Inspector.from_engine(conn)
    return table_name in inspector.get_table_names()

def index_exists(conn, table_name, index_name):
    inspector = Inspector.from_engine(conn)
    indexes = [index['name'] for index in inspector.get_indexes(table_name)]
    return index_name in indexes

def upgrade():
    conn = op.get_bind()

    # Drop foreign key constraints on the 'user' table referencing 'role' table
    if table_exists(conn, 'user'):
        inspector = Inspector.from_engine(conn)
        constraints = inspector.get_foreign_keys('user')
        for constraint in constraints:
            if constraint['referred_table'] == 'role':
                op.drop_constraint(constraint['name'], 'user', type_='foreignkey')

    # Drop the 'role' table
    if table_exists(conn, 'role'):
        op.drop_table('role')

    # Drop the 'user_roles' table
    if table_exists(conn, 'user_roles'):
        op.drop_table('user_roles')

    # Drop the 'user' table
    if table_exists(conn, 'user'):
        # Drop indexes explicitly if they exist
        if index_exists(conn, 'user', 'email'):
            op.execute('DROP INDEX email ON `user`')
        if index_exists(conn, 'user', 'username'):
            op.execute('DROP INDEX username ON `user`')

        # Drop the 'user' table
        op.drop_table('user')

    # Modify 'permissions' table
    if table_exists(conn, 'permissions'):
        with op.batch_alter_table('permissions', schema=None) as batch_op:
            batch_op.add_column(sa.Column('role_id', sa.Integer(), nullable=True))
            batch_op.create_foreign_key(
                'fk_permissions_role',    
                'permissions',       
                'role',              
                ['role_id'],         
                ['id']             
            )

    # Modify 'products' table
    if table_exists(conn, 'products'):
        with op.batch_alter_table('products', schema=None) as batch_op:
            batch_op.alter_column('name',
                   existing_type=sa.String(length=100),
                   type_=sa.String(length=80),
                   existing_nullable=False)
            batch_op.alter_column('description',
                   existing_type=sa.Text(),
                   type_=sa.String(length=200),
                   existing_nullable=True)
            batch_op.alter_column('price',
                   existing_type=sa.Float(),
                   type_=sa.Numeric(precision=10, scale=2),
                   nullable=True)
            batch_op.alter_column('stock',
                   existing_type=sa.Integer(),
                   nullable=True)
            batch_op.drop_column('is_deleted')

    # Modify 'sales' table
    if table_exists(conn, 'sales'):
        with op.batch_alter_table('sales', schema=None) as batch_op:
            batch_op.alter_column('quantity',
                   existing_type=sa.Integer(),
                   nullable=True)
            batch_op.alter_column('total_price',
                   existing_type=sa.Float(),
                   nullable=True)




def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('sales', schema=None) as batch_op:
        batch_op.alter_column('total_price',
               existing_type=mysql.FLOAT(),
               nullable=False)
        batch_op.alter_column('quantity',
               existing_type=mysql.INTEGER(),
               nullable=False)

    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_deleted', mysql.TINYINT(display_width=1), server_default=sa.text("'0'"), autoincrement=False, nullable=True))
        batch_op.alter_column('stock',
               existing_type=mysql.INTEGER(),
               nullable=False)
        batch_op.alter_column('price',
               existing_type=sa.Numeric(precision=10, scale=2),
               type_=mysql.FLOAT(),
               nullable=False)
        batch_op.alter_column('description',
               existing_type=sa.String(length=200),
               type_=mysql.TEXT(),
               existing_nullable=True)
        batch_op.alter_column('name',
               existing_type=sa.String(length=80),
               type_=mysql.VARCHAR(length=100),
               existing_nullable=False)

    with op.batch_alter_table('permissions', schema=None) as batch_op:
        batch_op.drop_constraint('fk_permissions_role', type_='foreignkey')
        batch_op.drop_column('role_id')

    op.create_table('user',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('username', mysql.VARCHAR(length=50), nullable=False),
    sa.Column('email', mysql.VARCHAR(length=120), nullable=False),
    sa.Column('password_hash', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('role_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['role.id'], name='user_ibfk_1'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.create_index('username', ['username'], unique=True)
        batch_op.create_index('email', ['email'], unique=True)

    op.create_table('role',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', mysql.VARCHAR(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('user_roles',
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('role_id', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['role_id'], ['roles.id'], name='user_roles_ibfk_2'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='user_roles_ibfk_1'),
    sa.PrimaryKeyConstraint('user_id', 'role_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    # ### end Alembic commands ###
