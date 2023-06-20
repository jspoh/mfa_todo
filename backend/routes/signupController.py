from flask import Blueprint, make_response, request


signupBp = Blueprint('/signup route', __name__)

@signupBp.route('/', methods=['POST'])
def newUser():
    payload = request.get_json()
    return make_response(payload, 201)