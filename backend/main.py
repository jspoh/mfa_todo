from flask import Flask
from flask_cors import CORS

# routes
from routes.homeController import homeBp
from routes.signupController import signupBp
from routes.loginController import loginBp

app = Flask(__name__)

CORS(app)

app.register_blueprint(homeBp)
app.register_blueprint(signupBp, url_prefix='/signup')
app.register_blueprint(loginBp, url_prefix='/login')


if __name__ == '__main__':
    app.run(debug=True)
    pass
