from flask import Flask,render_template, request, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
db = SQLAlchemy(app)
CORS(app, origins=["http://localhost:3000"])

@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(20), nullable=False)
    isCompleted = db.Column(db.Boolean, nullable=False)

@app.route("/index", methods=['GET'])
def index():
    return '<h1>aiueo</h1>'

@app.route("/get", methods=['GET'])
def get():
    todo = {'task':'料理', 'isCompleted':False}
    return todo

@app.route("/getAll", methods=['GET'])
def getAll():
    todos = db.session.query(Todo).all()
    res = {}
    for i, todo in enumerate(todos):
        res[i]={"task":todo.task, "isCompleted":todo.isCompleted}
    return make_response(res)


@app.route('/add', methods=["GET","POST"])
def add():
    if request.method == "POST":     
        data = request.get_json()
        task = data['task']
        isCompleted = data['isCompleted']
        todo = Todo(task=task,isCompleted=isCompleted)
        db.session.add(todo)
        db.session.commit()
        return make_response(jsonify({'message':'succeeded!'}))
    else:
        return "<span>addのget</span>"

if __name__ == "__main__":
    app.run(debug=True)