from flask import Blueprint, make_response, request
import json
from db.connect import sqlDb as db
from util.db import sanitizeInput, verifyInput
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
    (notBadReq, errMsg) = verifyInput(payload, ('username', 'name', 'password'))
    if not notBadReq:
        return make_response({"err": errMsg}, 400)
    pwd = Password(payload['password'])
    payload = sanitizeInput(payload)
    del payload['password']  # password will have been changed(sanitized) if `'` is present


    payload['salt'] = pwd.salt.hex()
    payload['hash'] = pwd.hash.hex()

    try:
        res = db.query("call createUser('{}', '{}', 0x{}, 0x{})".format(
            payload['username'], payload['name'], payload['salt'], payload['hash']))
        res = json.loads(res[0][0])
    except Exception as e:
        return make_response(str(e), 500)
    
    return make_response(res, 201)
