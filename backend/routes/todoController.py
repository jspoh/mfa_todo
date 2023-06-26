from flask import Blueprint, make_response, request
from datetime import datetime
import json
from db.connect import sqlDb as db
from util.db import sanitizeInput, verifyInput


todoBp = Blueprint('/todo route', __name__)


@todoBp.route('/', methods=['GET', 'POST', 'PUT', 'DELETE'])
@todoBp.route('/<postId>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def todoAction(postId: str = None):
    userId = 1
    '''
    POST
    {
        "userId": 1,
        "content": "sample todo content",
        "dateUpdated": 1687530416420
    }

    PUT
    {
        "postId": 1,
        "content": "sample todo content",
        "dateUpdated": 1687530416420

    }

    DELETE
    {
        "postId": 1,
    }
    '''
    if request.method == 'GET':
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
    
    if request.method == 'DELETE':
        try:
            db.query("call deleteTodo({})".format(postId))
        except Exception as e:
            return make_response({'err': str(e)}, 500)

        return make_response({'STATUS': 'DELETED'}, 200)

    payload = request.get_json()
    dt = round(datetime.now().timestamp()*1000)

    if request.method == 'POST':
        (notBadReq, errMsg) = verifyInput(payload, ('content',))
        if not notBadReq:
            return make_response({"err": errMsg}, 400)
        payload = sanitizeInput(payload)

        db.query("call createTodo({}, '{}', {})".format(payload['userId'],
                                                        payload['content'], payload['dateUpdated']))

        return make_response({'STATUS': 'CREATED'}, 201)

    # put
    (notBadReq, errMsg) = verifyInput(
        payload, ('postId', 'content', 'done'))
    if not notBadReq:
        return make_response({"err": errMsg}, 400)
    payload = sanitizeInput(payload)

    return make_response({'STATUS': 'UPDATED'}, 200)
