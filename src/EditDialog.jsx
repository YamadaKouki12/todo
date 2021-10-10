import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DialogTitle } from '@mui/material';
import axios from 'axios';

export const EditDialog = ({open,todos,setTodos,oldTask,handleOpen,handleClose}) => {

  const [input, setInput] = useState(oldTask);

  const handleInputChange = (e) => {setInput(e.target.value);};

  const editTodo = (oldTask,newTask) => {
    handleClose();
    axios.post('http://127.0.0.1:5000/update',{oldTask:oldTask,newTask:newTask})
    .then((res)=>{
      console.log(res.data);
    })
    const newTodos = todos.filter((todo) => {
      return todo.task !== oldTask;
    })
    setTodos([...newTodos,{task:newTask,isCompleted:false}]);
  }

  return(
    <React.Fragment>
      <button onClick={handleOpen} onClose={handleClose}>編集</button>
      <Dialog open={open}>
        <DialogTitle>編集</DialogTitle>
        <DialogContent>
          <input value={input} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose}>戻る</button>
          <button onClick={()=>editTodo(oldTask,input)}>決定</button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
};