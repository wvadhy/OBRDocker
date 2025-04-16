import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
import cryptography
import pymysql as mysql

load_dotenv()

app = Flask(__name__)
CORS(app)

connection = None


@app.route("/set", methods=["GET"])
def set_user():
    with connection:
        with connection.cursor() as cursor:
            sql = "INSERT INTO `users` (`full_name`, `user_email`, `user_password_hash`, `last_activity`) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, ('William Halliday', 'will@will.com', 'hjd9hd89djp2398', 'N/A'))

        connection.commit()

    return "set user data!"


@app.route("/get/<user>", methods=["GET", "POST"])
def get_user(user):
    with connection.cursor() as cursor:
        sql = "SELECT `id`, `user_email`, `user_password_hash`, `last_activity` FROM `users` WHERE `user_email`=%s"
        cursor.execute(sql, user)
        result = cursor.fetchone()

    return result if result else jsonify({"error": f"{user} is not a valid user"}), 404


@app.route("/getall", methods=["GET"])
def get_users():
    with connection.cursor() as cursor:
        sql = "SELECT `id`, `user_email`, `user_password_hash`, `last_activity` FROM `users`"
        cursor.execute(sql)
        result = cursor.fetchall()

    return jsonify(result) if result else jsonify({"error": "No users found"}), 404


@app.route("/connect", methods=["GET"])
def setup_connection():
    global connection
    connection = mysql.connect(host='obrsql',
                               user='user',
                               port=3306,
                               password='password',
                               database='obr',
                               charset='utf8mb4',
                               cursorclass=mysql.cursors.DictCursor)

    return {"components": [connection.host, connection.db.decode("utf-8"), str(connection.port),
                           connection.user.decode("utf-8"), connection.password.decode("utf-8")]}


@app.route("/delete/<user>", methods=["POST"])
def delete_user(user):
    with connection.cursor() as cursor:
        sql = "DELETE FROM `users` WHERE `user_email`=%s"
        cursor.execute(sql, user)
        result = cursor.fetchone()

    return result if result else "User not found..."


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8088)), debug=True)
