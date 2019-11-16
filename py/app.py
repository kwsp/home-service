
import sqlite3
from flask import Flask, jsonify
from flask import make_response
from flask_restful import Resource, Api, reqparse
from werkzeug.middleware.proxy_fix import ProxyFix

from get_db import get_db, execute_db, init_app

parser = reqparse.RequestParser()
parser.add_argument('n', type=int, help="ERROR: empty length of data")


class SensorData(Resource):
    def get(self):
        data = parser.parse_args()
        n_points = data.get('n')
        if n_points is None:
            n_points = 1000

        try:
            with get_db() as connection:
                cursor = connection.cursor()
                cursor.execute('''
                SELECT timestamp, temperature, activity FROM sensor_data
                ORDER BY timestamp DESC LIMIT {}
                '''.format(n_points))
                data = cursor.fetchall()
                timestamp = [tup[0] for tup in data]
                temperature = [tup[1] for tup in data]
                activity = [tup[2] for tup in data]
                res = {'timestamp': timestamp,
                       'temperature': temperature, 'activity': activity}
                cursor.close()
        except sqlite3.OperationalError:
            return {"error": "Querry failed"}

        return jsonify(res)


class PiTemp(Resource):
    pass


def create_app():

    # Instantiate flask app
    app = Flask(__name__, instance_relative_config=True)
    init_app(app)

    # Proxy support for NGINX
    app.wsgi_app = ProxyFix(app.wsgi_app)

    # Configure to see multiple erros in response
    app.config['BUNDLE_ERRORS'] = True

    @app.route('/')
    def index():
        return "Index.html placeholder"

    @app.errorhandler(404)
    def not_found(error):
        return make_response(jsonify({'error': "Not found"}), 404)

    # Flask_restful API
    api = Api(app)
    api.add_resource(SensorData, '/home_api/get_curr_data')
    api.add_resource(PiTemp, '/home_api/pi_temp')
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(port="8777", debug=True)
