import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import cryptography
import pymysql as mysql
from typing import Dict

"""
OBRDocker

A basic React-Python web based application used to present the potential
use of an overarching docker CI pipeline for the OBR-PLM system.
"""

load_dotenv()
app = Flask(__name__)
CORS(app)
connection: mysql.connections.Connection = None


# -- Creates a user utilising data provided by the React frontend and submits it to the MySQL db
@app.route("/set", methods=["POST"])
def set_user() -> jsonify:
    try:
        data = request.get_json()
        name = data["name"]
        email = data["email"]

        with connection:
            with connection.cursor() as cursor:
                sql = "INSERT INTO `users` (`full_name`, `user_email`, `user_password_hash`, `last_activity`) VALUES (%s, %s, %s, %s)"
                cursor.execute(sql, (name, email, 'hjd9hd89djp2398', 'N/A'))

            connection.commit()

        return jsonify({'message': 'Data submitted successfully!'})

    except Exception as e:
        return jsonify({"error": e}), 503


# -- Gets a specific user according to the passed in header parameter
@app.route("/get/<user>", methods=["GET", "POST"])
def get_user(user) -> jsonify:
    try:
        with connection.cursor() as cursor:
            sql = "SELECT `id`, `user_email`, `user_password_hash`, `last_activity` FROM `users` WHERE `user_email`=%s"
            cursor.execute(sql, user)
            result = cursor.fetchone()

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": e}), 503


# -- Gets all users
@app.route("/get_all", methods=["GET"])
def get_users() -> jsonify:
    try:
        with connection.cursor() as cursor:
            sql = "SELECT `id`, `user_email`, `user_password_hash`, `last_activity` FROM `users`"
            cursor.execute(sql)
            result = cursor.fetchall()

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 503


# -- Establishes a connection to the MySQL database, change host to 'localhost' for on machine testing
@app.route("/connect", methods=["GET"])
def setup_connection() -> jsonify:
    global connection

    try:
        connection = mysql.connect(host='obrsql',
                                   user='user',
                                   port=3306,
                                   password='password',
                                   database='obr',
                                   charset='utf8mb4',
                                   cursorclass=mysql.cursors.DictCursor)

        return {"components": [connection.host, connection.db.decode("utf-8"), str(connection.port),
                               connection.user.decode("utf-8"), connection.password.decode("utf-8")]}

    except Exception as e:

        return {"error": str(e)}, 503


# -- Deletes a user utilising data provided by the React frontend
@app.route("/delete", methods=["POST"])
def delete_user() -> jsonify:
    try:

        data = request.get_json()
        user = data.get('id')

        if not user:
            return jsonify({'error': 'User does not exist'}), 404

        with connection.cursor() as cursor:
            sql = "DELETE FROM `users` WHERE `id`=%s"
            cursor.execute(sql, user)

        connection.commit()

        return jsonify({'success': True, 'message': f'Entry {user} deleted'})

    except Exception as e:
        return jsonify({'error': str(e)}), 503


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8088)), debug=True)
