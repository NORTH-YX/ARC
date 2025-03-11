import React, { useState, useEffect } from 'react';
import NewItem from './NewItem';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, TableBody, CircularProgress } from '@mui/material';
import Moment from 'react-moment';

function App() {
    const [isLoading, setLoading] = useState(false);
    const [isInserting, setInserting] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setIsAuthenticated(true);
            fetchTasks(token);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const token = localStorage.getItem('jwtToken');
            fetchTasks(token);
        }
    }, [isAuthenticated]);

    const fetchTasks = (token) => {
        setLoading(true);
        fetch('/tasks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then((result) => {
                console.log("Fetched tasks:", result); // Debugging
                setLoading(false);
                setTasks(result.map(task => ({
                  taskId: task.taskId,
                  description: task.description,
                  taskName: task.taskName,
                  priority: task.priority,
                  sprint: task.sprint ? { sprintId: task.sprint.sprintId } : null,  // Guarda objeto sprint
                  user: task.user ? { userId: task.user.userId } : null,  // Guarda objeto user
                  creationDate: task.creationDate,
                  estimatedFinishDate: task.estimatedFinishDate,
                  realFinishDate: task.realFinishDate,
                  status: task.status,
                  deletedAt: task.deletedAt
              })));
            })
            .catch(error => {
                setLoading(false);
                setError(error);
            });
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.jwt;
            localStorage.setItem('jwtToken', token);
            setIsAuthenticated(true);
        } else {
            alert('Invalid credentials');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setIsAuthenticated(false);
    };

    const deleteTask = (deleteId) => {
        const token = localStorage.getItem('jwtToken');
        fetch(`/tasks/${deleteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(
                (result) => {
                    const remainingTasks = tasks.filter(task => task.id !== deleteId);
                    setTasks(remainingTasks);
                },
                (error) => {
                    setError(error);
                }
            );
    };

    const addTask = (text) => {
        setInserting(true);
        const token = localStorage.getItem('jwtToken');
        var data = { "description": text };
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong ...');
            }
        }).then(
            (newTask) => {
                setTasks([newTask, ...tasks]);
                setInserting(false);
            },
            (error) => {
                setInserting(false);
                setError(error);
            }
        );
    };

    const updateTask = (id, status) => {
      const token = localStorage.getItem('jwtToken');
      const task = tasks.find(task => task.taskId === id); // Asegúrate de usar "id"
  
      if (!task) {
          console.error(`Task with ID ${id} not found`);
          return;
      }
  
      // Validar user y sprint antes de acceder a sus propiedades
      const updatedTask = {
          ...task,
          status: status,
          user: task.user ? { userId: task.user.userId } : null,
          sprint: task.sprint ? { sprintId: task.sprint.sprintId } : null
      };
  
      console.log("Sending updated task:", updatedTask); // Debugging
  
      fetch(`/tasks/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedTask)
      })
      .then(response => response.ok ? response.json() : Promise.reject('Update failed'))
      .then(updatedTask => {
          setTasks(tasks.map(task => task.taskId === id ? updatedTask : task));
      })
      .catch(error => console.error("Error updating task:", error));
  };
  
  
  

    if (!isAuthenticated) {
        return (
            <div className="App">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <label>
                        Email:
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <br />
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }

    return (
        <div className="App">
            <h1>MY TODO LIST</h1>
            <Button onClick={handleLogout}>Logout</Button>
            <NewItem addItem={addTask} isInserting={isInserting} />
            {error && <p>Error: {error.message}</p>}
            {isLoading && <CircularProgress />}
            {!isLoading &&
                <div id="maincontent">
                    <table id="tasklistNotDone" className="tasklist">
                        <TableBody>
                            {tasks.map(task => (
                                <tr key={task.taskId}>
                                    <td className="description">{task.description}</td>
                                    <td className="date">Creation Date<Moment format="MMM Do hh:mm:ss">{task.creationDate}</Moment></td>
                                    <td className="estimatedFinishDate">Estimated Finish Date<Moment format="MMM Do hh:mm:ss">{task.estimatedFinishDate}</Moment></td>
                                    <td className="status">
                                        <select value={task.status} onChange={(e) => updateTask(task.taskId, e.target.value)}>
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td><Button startIcon={<DeleteIcon />} variant="contained" className="DeleteButton" onClick={() => deleteTask(task.id)} size="small">
                                        Delete
                                    </Button></td>
                                </tr>
                            ))}
                        </TableBody>
                    </table>
                </div>
            }
        </div>
    );
}

export default App;