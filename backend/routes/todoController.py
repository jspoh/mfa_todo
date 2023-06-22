from flask import Blueprint, make_response, request
from datetime import datetime
from db.connect import sqlDb as db
from util.db import sanitizeInput, verifyInput


todoBp = Blueprint('/todo route', __name__)


@todoBp.route('/:id', methods=['GET', 'POST', 'PUT', 'DELETE'])
def todoAction(id: str):
    '''
    {
        "username": "dev",
        "password": "Developer23."
    }
    '''
    if request.method == 'GET':
        return make_response('', 501)
     
    payload = request.get_json()
    dt = round(datetime.now().timestamp()*1000)

    if request.method == 'POST':
        verifyInput(payload, ('content',))
        payload = sanitizeInput(payload)

        return make_response({'STATUS': 'CREATED'}, 201)
    
    if request.method == 'PUT':
        verifyInput(payload, ('postId', 'content', 'done'))
        payload = sanitizeInput(payload)

        return make_response({'STATUS': 'UPDATED'}, 200)
    
    # delete
    verifyInput(payload, ('postId'))

    return make_response({'STATUS': 'DELETED'}, 200)
