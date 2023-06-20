from os import getenv, environ
from dotenv import load_dotenv

load_dotenv()

env = {
    'DB_USER': getenv('DB_USER'),
    'DB_PASSWORD': getenv('DB_PASSWORD'),
    'DB_HOST': getenv('DB_HOST'),
    'DB_PORT': getenv('DB_PORT'),
    'DB_DATABASE': getenv('DB_DATABASE'),
}


if __name__ == '__main__':
    print(env)
