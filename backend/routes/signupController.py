from flask import Blueprint, make_response, request
from db.connect import sqlDb as db
from util.sanitize import sanitizeInput
from util.Password import Password


signupBp = Blueprint('/signup route', __name__)


@signupBp.route('/', methods=['POST'])
def newUser():
    '''
    sample payload
    {
        "username": "admin",
        "name": "dev",
        "password": "password"
    }
    '''
    payload: dict = request.get_json()
    payload = sanitizeInput(payload)

    pwd = Password(payload['password'])

    payload['salt'] = pwd.salt.hex()
    payload['hash'] = pwd.hash.hex()
    print(payload)

    try:
        res = db.query("call createUser('{}', '{}', 0x{}, 0x{})".format(
            payload['username'], payload['name'], payload['salt'], payload['hash']))
    except Exception as e:
        return make_response(str(e), 500)

    return make_response(res, 201)
