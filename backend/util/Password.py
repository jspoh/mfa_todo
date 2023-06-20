import bcrypt


class Password:
    def __init__(self, pwd: str) -> None:
        self.__pwd = pwd.encode('utf-8')
        self.__salt: bytes = bcrypt.gensalt()
        self.__hash: bytes = self.__hashPwd()

    @property
    def salt(self):
        return self.__salt

    @property
    def hash(self) -> bytes:
        return self.__hash

    def __hashPwd(self) -> bytes:
        return bcrypt.hashpw(self.__pwd, self.__salt)

    def __str__(self) -> str:
        return self.__hash.decode()
