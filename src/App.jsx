import React,{useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import { EditDialog } from './EditDialog';

function App() {

  const [input, setInput] = useState('');
  // const [todos, setTodos] = useState([{task:"掃除",isCompleted:false},{task:"洗濯",isCompleted:true}]);
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {setOpen(true);};
  const handleClose = () => {setOpen(false);};

  //Read
  useEffect(()=>{
    axios.get('http://127.0.0.1:5000/readAll')
    .then((res)=>{
      const todosJson = res.data;
      const newTodos = [];
      for(let i in todosJson){
        newTodos.push(todosJson[i]);
      }
      setTodos(newTodos);
    })
  },[])

  const handleInputChange = (e) => {
    setInput(e.target.value);
  }
  
  // Create
  const addTodo = () => {
    const newTask = {task:input, isCompleted:false};
    axios.post('http://127.0.0.1:5000/add',newTask)
    .then((res)=>{
      console.log(res.data);
    })
    setTodos([...todos,newTask]);
    setInput('');
  }

  // Update
  const completeTodo = (task) => {
    axios.post('http://127.0.0.1:5000/complete',{task:task})
    .then((res) => {
      console.log(res.data);
    })
    const newTodos = todos.filter((todo) => {
      return todo.task !== task;
    })
    setTodos([...newTodos,{task:task,isCompleted:true}]);
  }

  // Delete
  const deleteTodo = (task) => {
    axios.post('http://127.0.0.1:5000/delete',{task:task})
    .then((res) => {
      console.log(res.data);
    })
    const newTodos = todos.filter((todo) => {
      return todo.task !== task;
    })
    setTodos([...newTodos]);
  }
  
  return (
    <React.Fragment>
      <h1>TODOアプリ</h1>
      <h3>TODOを追加</h3>
      <input value={input} onChange={handleInputChange} />
      <button onClick={addTodo}>追加</button>
      <h3>やることリスト</h3>
      <ul>
        {todos.map((todo,index) => {
          return(
            todo.isCompleted===false &&          
              <li key={todo.task+index}>
                {todo.task}
                <EditDialog open={open} todos={todos} setTodos={setTodos} handleOpen={handleOpen} handleClose={handleClose} oldTask={todo.task}/>
                <button onClick={()=>completeTodo(todo.task)}>完了</button>
              </li>                            
          )
        })}
      </ul>
      <h3>やったことリスト</h3>
      <ul>
        {todos.map((todo,index)=> {
          return(
            todo.isCompleted===true && 
            <li key={index}>
              {todo.task}
              <button onClick={()=>deleteTodo(todo.task)}>削除</button>
            </li>
          )          
        })}
      </ul>    
    </React.Fragment>
  );
}

export default App;
