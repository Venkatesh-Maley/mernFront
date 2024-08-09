import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Fetch tasks using GraphQL
  useEffect(() => {
    axios
      .post('http://localhost:5000/graphql', {
        query: `
          query {
            getTasks {
              id
              todo
              date
            }
          }
        `,
      })
      .then((response) => setItems(response.data.data.getTasks))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  // Add new task using GraphQL
  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/graphql', {
        query: `
          mutation {
            addTask(todo: "${newTask}") {
              id
              todo
              date
            }
          }
        `,
      })
      .then((response) => setItems(response.data.data.addTask))
      .catch((error) => console.error('Error adding task:', error));
  };

  // Delete task using GraphQL
  const deleteHandler = (id) => {
    axios
      .post('http://localhost:5000/graphql', {
        query: `
          mutation {
            deleteTask(id: "${id}") {
              id
              todo
              date
            }
          }
        `,
      })
      .then((response) => setItems(response.data.data.deleteTask))
      .catch((error) => console.error('Error deleting task:', error));
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        <form onSubmit={submitHandler} className="form-inline">
          <div className="form-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="New Task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mb-2 ml-2">
            Submit
          </button>
        </form>
      </div>
      <div className="mt-4">
        {items.map((task) => (
          <div key={task.id} className="card mb-2">
            <div className="card-body d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">{task.todo}</h5>
              <button className="btn btn-danger" onClick={() => deleteHandler(task.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
