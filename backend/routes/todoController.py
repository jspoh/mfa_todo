from flask import Blueprint, make_response, request
from datetime import datetime
import json
from db.connect import sqlDb as db
from util.db import sanitizeInput, verifyInput


todoBp = Blueprint('/todo route', __name__)


@todoBp.route('/<postId>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def todoAction(postId: str):
    userId = 1
    '''
    POST
    {
        "content": "sample todo content"
    }

    PUT
    {
        "postId": 1,
        "content": "sample todo content"
    }

    DELETE
    {
        "postId": 1,
    }
    '''
    if request.method == 'GET':
        print(postId)
        if postId == '%':
            res = db.query("call getTodo({}, {})".format(userId, 'NULL'))
            res = json.loads(res[0][0])

            for todoItem in res:
                todoItem['done'] = False if todoItem['done'] == 'base64:type16:AA==' else True
        else:
            res = db.query("call getTodo({}, {})".format(userId, postId))
            try:
                res = json.loads(res[0][0])
            except IndexError as e:
                return make_response({'err': 'post does not exist - {}'.format(str(e))}, 400)

            res['done'] = False if res['done'] == 'base64:type16:AA==' else True

        return make_response(res, 200)
     
    payload = request.get_json()
    dt = round(datetime.now().timestamp()*1000)

    if request.method == 'POST':
        (notBadReq, errMsg) = verifyInput(payload, ('content',))
        if not notBadReq:
            return make_response({"err": errMsg}, 400)
        payload = sanitizeInput(payload)

        return make_response({'STATUS': 'CREATED'}, 201)
    
    if request.method == 'PUT':
        (notBadReq, errMsg) = verifyInput(payload, ('postId', 'content', 'done'))
        if not notBadReq:
            return make_response({"err": errMsg}, 400)
        payload = sanitizeInput(payload)

        return make_response({'STATUS': 'UPDATED'}, 200)
    
    # delete
    (notBadReq, errMsg) = verifyInput(payload, ('postId'))
    if not notBadReq:
        return make_response({"err": errMsg}, 400)

    return make_response({'STATUS': 'DELETED'}, 200)
