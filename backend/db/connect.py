import sqlalchemy as db
from util.env import env


class DatabaseConnectionError(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class MySQLDatabase:
    def __init__(self) -> None:
        self._engine = db.create_engine(
            url="mysql+pymysql://{0}:{1}@{2}:{3}/{4}".format(
                env['DB_USER'], env['DB_PASSWORD'], env['DB_HOST'], env['DB_PORT'], env['DB_DATABASE'],
                echo=True
            )
        )
        self._connection = self._engine.connect()

    @property
    def connection(self):
        return self._connection

    def query(self, q: str):
        result: db.engine.cursor.CursorResult = self._connection.execute(db.text(q))
        self._connection.commit()
        return result.all()
    
    def sanitize(self):
        pass


sqlDb = MySQLDatabase()