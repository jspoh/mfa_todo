from flask import Blueprint, request, make_response


homeBp = Blueprint('/ route', __name__)

@homeBp.route('/', methods=['GET'])
def getStatus():
    return make_response({'STATUS': 'RUNNING'}, 200)


