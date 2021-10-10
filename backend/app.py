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

@app.route("/readAll", methods=['GET'])
def readAll():
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
        return make_response(jsonify({'message':'追加完了!'}))

@app.route("/complete", methods=['POST'])
def complete():
    data = request.get_json()
    task = data['task']
    todo = db.session.query(Todo).filter_by(task = task).first()
    todo.isCompleted = True
    db.session.commit()
    return make_response(jsonify({'message':'更新完了!'}))

@app.route('/delete', methods = ['POST'])
# @app.route('/delete', methods = ['GET'])
def delete():
    data = request.get_json()
    task = data['task']
    todo = db.session.query(Todo).filter_by(task = task).first()
    # todos = Todo.query().all()
    db.session.delete(todo)
    db.session.commit()
    return make_response(jsonify({'message':'削除完了!'}))

@app.route('/update', methods = ['POST'])
def update():
    data = request.get_json()
    oldTask = data['oldTask']
    newTask = data['newTask']
    todo = db.session.query(Todo).filter_by(task = oldTask).first()
    todo.task=newTask
    db.session.commit()
    return make_response(jsonify({'message':'更新完了!'}))

if __name__ == "__main__":
    app.run(debug=True) 