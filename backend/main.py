from flask import Flask
from flask_cors import CORS

# routes
from routes.homeController import homeBp
from routes.signupController import signupBp

app = Flask(__name__)

CORS(app)

app.register_blueprint(homeBp)
app.register_blueprint(signupBp, url_prefix='/signup')


if __name__ == '__main__':
    app.run(debug=True)
    pass
