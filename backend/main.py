from flask import Flask, Blueprint, send_from_directory
from flask_cors import CORS

from routes.homeController import homeBp
from routes.signupController import signupBp
from routes.loginController import loginBp
from routes.todoController import todoBp

app = Flask(__name__, static_folder='build', template_folder='build', static_url_path='')

CORS(app, supports_credentials=True)

apiBp = Blueprint('/api route', __name__)
apiBp.register_blueprint(homeBp)
apiBp.register_blueprint(signupBp, url_prefix='/signup')
apiBp.register_blueprint(loginBp, url_prefix='/login')
apiBp.register_blueprint(todoBp, url_prefix='/todo')

app.register_blueprint(apiBp, url_prefix='/api')

@app.route('/', methods=['GET'])
def getApp():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def getAppWithRoute(e):
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True, port=5000, host="0.0.0.0")#host="127.0.0.1")
    pass
