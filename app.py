from flask import Flask, url_for, render_template, request
from sqlite3 import connect
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/send', methods = ['POST'])
def send():
    user = request.form['user']
    text = request.form['text']
    print(user, text)

    if not user or not text: return '', 404
    connection = connect('database.db')
    cursor = connection.cursor()

    cursor.execute('INSERT INTO geral VALUES(?, ?, ?)', (datetime.now(), user, text))
    connection.commit()
    cursor.close()
    connection.close()

    return '$c.01'

if __name__ == '__main__':
    app.run()