from flask import Blueprint, make_response, request
from typing import Tuple
import json
from base64 import b64encode
from db.connect import sqlDb as db
from util.db import sanitizeInput, verifyInput
from util.Password import Password


loginBp = Blueprint('/login route', __name__)


def getSaltAndHash(username: str) -> Tuple[bytes] | Tuple[bool | str]:
    print(username)
    try:
        res = db.query("call getSaltAndHash('{}')".format(username))
        print(res)
        res = (res[0][0], res[0][1])
    except Exception as e:
        res = (False, str(e))
    
    return res


@loginBp.route('/', methods=['GET', 'POST'])
def login():
    '''
    {
        "username": "dev",
        "password": "Developer23."
    }
    '''
    if request.method == 'GET':
        return make_response('', 501)
     
    elif request.method == 'POST':
        payload = request.get_json()
        verifyInput(payload, ('username', 'password'))
        # payload = sanitizeInput(payload)

        (salt, hash) = getSaltAndHash(payload['username'])

        if not salt:
            return make_response({"err": str(hash)}, 403)
        
        print(payload, hash)

        pwd = Password(payload['password'], salt)
        if hash == pwd.hash:
            return make_response({'STATUS': 'AUTHORIZED'}, 200)
        else:
            return make_response({'err': 'invalid username or password'}, 403)


        



