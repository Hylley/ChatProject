from flask import Flask, url_for, render_template, request
from flask_socketio import SocketIO, emit
from sqlite3 import connect
from datetime import datetime
from json import dumps
from waitress import serve
import eventlet
eventlet.monkey_patch()


MAX_FETCH_SIZE = 50

app = Flask(__name__)
app.config['SECRET_KEY'] = 'aaaa'
skt = SocketIO(app, async_mode=None)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/send', methods = ['POST'])
def send():
    user = request.form['user']
    text = request.form['text']
    pfp = request.form['profile']
    print(user, text)

    if not user or not text: return 'Bad Request.', 404
    connection = connect('database.db')
    cursor = connection.cursor()

    cursor.execute('INSERT INTO geral VALUES(?, ?, ?, ?)', (datetime.now(), user, text, pfp))
    connection.commit()
    cursor.close()
    connection.close()

    skt.emit(
        'fetch',
        {
            'user': user,
            'content': text,
            'profile': pfp,
            'datetime': str(datetime.now())
        },
        broadcast=True
    )

    return '$c.01'


@app.route('/resume', methods = ['GET'])
def fetch():
    connection = connect('database.db')
    cursor = connection.cursor()

    messages = cursor.execute('SELECT * FROM geral ORDER BY datetime ASC LIMIT ?', (MAX_FETCH_SIZE,)).fetchall()
    response = {}

    for i, message in enumerate(messages):
        response[i] = {
            'user': message[1],
            'content': message[2],
            'datetime': message[0],
            'profile': message[3]
        }

    return dumps(response, indent = 4, ensure_ascii=False).encode('utf8')


# @skt.on('fetch', namespace='/fetch')
# def fetch(data):
#     if not data: return 'Bad request', 404

#     connection = connect('database.db')
#     cursor = connection.cursor()

#     if data['since'] == None:
#         messages = cursor.execute('SELECT * FROM geral ORDER BY datetime ASC LIMIT ?', (MAX_FETCH_SIZE,)).fetchall()
#     else:
#         messages = cursor.execute('SELECT * FROM geral WHERE DATETIME(datetime) > DATETIME(?) ORDER BY datetime ASC', (since,)).fetchall()
    
#     response = {}

#     for i, message in enumerate(messages):
#         response[i] = {
#             'user': message[1],
#             'content': message[2],
#             'datetime': message[0],
#             'profile': message[3]
#         }

#     emit('fetch', dumps(response, indent = 4, ensure_ascii=False).encode('utf8'), json=True, broadcast=True)





if __name__ == '__main__':
    skt.run(host='0.0.0.0', port=5000)
    #serve(app, host='0.0.0.0', port=5000)