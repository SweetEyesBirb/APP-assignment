from flask import Flask, render_template, jsonify, request, make_response
import json

app = Flask(__name__)


@app.route('/')
def index():
  '''
    This function handles the root ('/') path of the web application. 
    It renders the html page stored at index.html
    
    parameters:
    - none
    
    return:
    - index.html page
    '''

  return render_template('index.html')


@app.route("/events", methods=['GET'])
def get_events_list():
  '''
    This function will retrieve a list of events using a GET request from a json 
    data file and route it to ('/events').

    methods:
    - GET

    parameters:
    - none

    return:
    - the object stored in the database in json format
    '''
  
  """ Next line opens the file stored in the url with read only permissions and
    saves it in a new variable. The "with" keyword is used so that python closes
    the file after reading the contents. """
  with open('data/database.json', 'r') as json_file:
    events = json.load(
      json_file
    )  # json.load() parses the json file so that it can be stored in a variable (server side conversion from JSON)
    return jsonify(
      events
    )  # the parsed json file is returned prior conversion to JSON format (server side conversion to JSON)


# This route set to "/events" should only be available when the PUT method is used
@app.route("/events", methods=['PUT'])
def update_events_list():
  '''
    This function updates the events list in the database using the route 
    ('/events').

    methods:
    - PUT

    parameters:
    - none

    Returns:
    - a response string and the HTTP status code informing if the process was executed successfully or it failed.
    '''
  if request.is_json:
    data = request.get_json(
    )  # Parses the data sent by the user as JSON into a variable
    with open(
      'data/database.json', 'r'
    ) as json_file:
      json_data = json.load(
        json_file
      )  # parses the JSON data from the file stored in a variable to save it into another variable called "json_data".
      json_data["eventsList"].append(data)  # Pushes the object stored in the "data" variable to the 'eventsList' array in the "json_data" variable
    with open(
        'data/database.json', 'w'
    ) as json_file_to_write:  # opens the file with "write" permissions and closes it once it has stored the file into a variable
      json.dump(
        json_data, json_file_to_write
      )  # Writes the data stored in the "json_data" variable to the file stored in "file_to_write"
    return "Data saved successfully!", 200
  else:
    # The request body wasn't JSON so return a 400 HTTP status code
    return "Uploading database failed as data is not in JSON format!", 400


# run app
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)  # port automatically selected by Replit was "81"
