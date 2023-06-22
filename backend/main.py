from flask import Flask
from flask_cors import CORS

# routes (can also use a /api prefix)
from routes.homeController import homeBp
from routes.signupController import signupBp
from routes.loginController import loginBp
from routes.todoController import todoBp

app = Flask(__name__)

CORS(app)

app.register_blueprint(homeBp)
app.register_blueprint(signupBp, url_prefix='/signup')
app.register_blueprint(loginBp, url_prefix='/login')


if __name__ == '__main__':
    app.run(debug=True)
    pass
