from distutils.command.upload import upload
from importlib.resources import path
# from urllib import request
from flask import Flask
from flask import request
# from flask import send_file
from flask import current_app
from flask import send_from_directory
from main import *
from flask_cors import CORS
from os.path import exists

app = Flask(__name__)
CORS(app)


# @app.route("/members")
# def members():
#     return {"members": ["Member1", "Member2", "Member3"]}

@app.route("/convert/<path:playlistId>")
def convert(playlistId):
    try:
        run(playlistId)
    except Exception as error:
        return str(error), 400

    return {};

@app.route("/download/<fn>")
def download(fn):
    # filename = request.args.get('filename')
    uploads = os.path.join(current_app.root_path, 'saved_zips')

    fileWithExtension = fn + '.zip';

    file_exists = exists(uploads + "/" + fileWithExtension);

    if not file_exists:
         raise Exception('File not found. cannot download a non existent file.') 

    return send_from_directory(directory=uploads, path=fileWithExtension) 

# @app.route("/testing/<fn>")
# def testing(fn):
#     testing = os.path.join(current_app.root_path, 'testing123')
#     # fileWithExtension = fn + 'zip';
#     # print(fileWithExtension)
#     return testing;

if __name__ == "__main__":
    app.run(debug=True)
 