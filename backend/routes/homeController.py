from flask import Blueprint, request, make_response


homeBp = Blueprint('/ route', __name__)

@homeBp.route('/', methods=['GET'])
def getStatus():
    cookie = request.cookies.get('test', None)
    print(cookie)
    response = make_response({'STATUS': 'RUNNING'}, 200)
    # response.set_cookie('test', 'works!')
    # response.delete_cookie('test')
    return response


