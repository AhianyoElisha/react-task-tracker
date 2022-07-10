import { useState, useEffect } from "react"
import React from "react";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTask] = useState([])
  useEffect(() => {
    const getTask = async() => {
      const taskFromServer = await fetchTasks()
      setTask(taskFromServer)
    }

    getTask()
  }, [])

//fetch data from server
const fetchTasks = async() => {
  const res = await fetch('http://localhost:5000/tasks')
  const data = await res.json()

  return data
}


//fetch single data from server
const fetchTask = async(id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()

  return data
}



//Add Task
const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: {
      'Content-type' : 'application/json',
    },
    body: JSON.stringify(task),
  })

  const data = await res.json()

  setTask([...tasks, data])
  
  
  // const id = Math.floor(Math.random() * 10000) + 1
  // const newTask = {id, ...task}
  // setTask([...tasks, newTask])
}

//Delete Task
const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'DELETE'
  })

  setTask(tasks.filter((task) => task.id !== id))
}

//Toggle Reminder
const toggleReminder = async (id) => {
  //selecting the task to toggle 
  const taskToToggle = await fetchTask(id)
  //update reminder of selected task
  const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder}

  //making an http request in order to update the database
  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify(updatedTask)
  })

  const data = await res.json()

  setTask(tasks.map((task) => task.id === id ?{...task, reminder: data.reminder} : task))
}
  return (
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
      {showAddTask && <AddTask onAdd={addTask}/>}
      {tasks.length > 0 ?<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : 'No Task To Show'} 
      <Footer/>
    </div>
  );
}

export default App;
