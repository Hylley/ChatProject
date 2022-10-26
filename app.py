from flask import Flask, url_for, render_template, request
from sqlite3 import connect
from datetime import datetime

MAX_FETCH_SIZE = 10

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/send', methods = ['POST'])
def send():
    user = request.form['user']
    text = request.form['text']
    print(user, text)

    if not user or not text: return 'Bad Request.', 404
    connection = connect('database.db')
    cursor = connection.cursor()

    cursor.execute('INSERT INTO geral VALUES(?, ?, ?)', (datetime.now(), user, text))
    connection.commit()
    cursor.close()
    connection.close()

    return '$c.01'

@app.route('/fetch', methods = ['GET'])
def fetch():
    since = request.args.get('since')

    connection = connect('database.db')
    cursor = connection.cursor()

    if not since:
        messages = cursor.execute('SELECT * FROM geral ORDER BY column DESC LIMIT ?', (MAX_FETCH_SIZE,)).fetchall()
        print(messages)
        return 'GG'
    
    messages = cursor.execute('SELECT * FROM geral ORDER BY column DESC WHERE datetime < ?', (since,)).fetchall()
    print(messages)
    return 'GG'




if __name__ == '__main__':
    app.run()