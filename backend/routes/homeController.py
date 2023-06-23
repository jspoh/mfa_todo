from flask import Blueprint, request, make_response
import json
from db.connect import sqlDb as db


homeBp = Blueprint('/ route', __name__)

@homeBp.route('/', methods=['GET'])
def getStatus():
    # cookie = request.cookies.get('test', None)
    # print(cookie)
    response = make_response({'STATUS': 'RUNNING'}, 200)
    # response.set_cookie('test', 'works!')
    # response.delete_cookie('test')
    return response

@homeBp.route('/user', methods=['GET'])
def getUser():
    try:
        sessionCookie = request.cookies.get('session', None)

        if not sessionCookie:
            return make_response({'loggedIn': False, 'data': None}, 200)
        
        res = db.query("call getUserBySessionId('{}')".format(sessionCookie))
        res = json.loads(res[0][0])
        return make_response({'loggedIn': True, 'data': res}, 200)
    except Exception as e:
        return make_response({'err': str(e)}, 500)