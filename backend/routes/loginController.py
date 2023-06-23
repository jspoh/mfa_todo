from flask import Blueprint, make_response, request
from uuid import uuid4
from typing import Tuple
from db.connect import sqlDb as db
from util.db import sanitizeInput, verifyInput
from util.Password import Password


loginBp = Blueprint('/login route', __name__)


def getSaltAndHash(username: str) -> Tuple[int, bytes, bytes] | Tuple[bool, str]:
    try:
        res = db.query("call getSaltAndHash('{}')".format(username))
        res = (res[0][0], res[0][1], res[0][2])
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
        (notBadReq, errMsg) = verifyInput(payload, ('username', 'password'))
        if not notBadReq:
            return make_response({"err": errMsg}, 400)
        # payload = sanitizeInput(payload)

        (userId, salt, hash) = getSaltAndHash(payload['username'])

        if not salt:
            # return make_response({"err": str(hash)}, 403)  # for debugging
            return make_response({"err": 'invalid username or password'}, 403)

        pwd = Password(payload['password'], salt)
        if hash == pwd.hash:
            # authenticated
            sessionId = uuid4()
            response = make_response({'STATUS': 'AUTHORIZED'}, 200)
            try:
                res = db.query("call createSession({}, '{}')".format(userId, sessionId))
                # print(res)
                response.set_cookie('session', str(sessionId))
                return response
            except Exception as e:
                return make_response({'err': str(e)}, 500)
        else:
            return make_response({'err': 'invalid username or password'}, 403)


        



