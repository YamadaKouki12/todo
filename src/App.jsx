import React,{useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([{task:"掃除",isCompleted:false},{task:"洗濯",isCompleted:true}]);

  useEffect(()=>{
    axios.get('http://127.0.0.1:5000/getAll')
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
  
  const addTodo = () => {
    const newTask = {task:input, isCompleted:false};
    axios.post('http://127.0.0.1:5000/add',{task:input, isCompleted:false})
    .then((res)=>{
      console.log(res.data);
    })
    setTodos([...todos,newTask]);
    setInput('');
  }

  const completeTodo = () => {

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
              <li key={todo.task}>
                {todo.task}
                <button>編集</button>
                <button onClick={()=>completeTodo(index)}>完了</button>
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
              <button>削除</button>
            </li>
          )          
        })}
      </ul>    
    </React.Fragment>
  );
}

export default App;
