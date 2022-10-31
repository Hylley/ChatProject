from flask import Flask, url_for, render_template, request
from flask_socketio import SocketIO, emit
from sqlite3 import connect
from datetime import datetime
from json import dumps
from waitress import serve
from eventlet import monkey_patch
monkey_patch()


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


if __name__ == '__main__':
    #app.run(host='0.0.0.0', port=5000) # Flask-only development server;
    skt.run(app, host='0.0.0.0', port=5000) # Websocket production server;
    #serve(app, host='0.0.0.0', port=5000) # Flask-only production server;