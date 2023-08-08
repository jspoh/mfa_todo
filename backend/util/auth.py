from db.connect import sqlDb as db
import json


def authenticateUser(cookie: str):
    '''
    :param cookie: takes in 36 character session cookie value
    :returns tuple: `(userId, username, name)`
    '''
    res = db.query("call getUserBySessionId('{}')".format(cookie))
    try:
        res = json.loads(res[0][0])
    except Exception as e:
        print(res)

    return (res['userId'], res['username'], res['name'])