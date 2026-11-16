
import { useEffect, useState } from "react";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Get tasks from backend
    const getTasks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/tasks`);

            if (!response.ok) {
                throw new Error("Unable to load tasks");
            }

            const data = await response.json();
            setTasks(data);
            setMessage("");
        } catch (error) {
            setMessage("Cannot connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTasks();
    }, []);

    // Add task
    const addTask = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        try {
            const response = await fetch(`${API_URL}/api/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    description
                })
            });

            if (!response.ok) {
                throw new Error("Unable to add task");
            }

            setTitle("");
            setDescription("");
            getTasks();
        } catch (error) {
            setMessage("Could not add task. Check your connection.");
        }
    };

    // Mark task completed
    const completeTask = async (id, completed) => {
        try {
            const response = await fetch(`${API_URL}/api/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ completed: !completed })
            });

            if (!response.ok) {
                throw new Error("Update failed");
            }

            getTasks();
        } catch (error) {
            setMessage("Could not update task.");
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/tasks/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            getTasks();
        } catch (error) {
            setMessage("Could not delete task.");
        }
    };

    const completedCount = tasks.filter(
        task => task.completed
    ).length;

    return (
        <>
            {/* Navigation */}
            <nav className="navbar navbar-expand-lg navbar-dark main-nav">
                <div className="container">
                    <a className="navbar-brand" href="#">
                        My Student Tasks
                    </a>

                    <button
                        className="navbar-toggler"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarMenu"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarMenu">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#home">
                                    Home
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#tasks">
                                    My Tasks
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#about">
                                    About
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <header className="hero text-center" id="home">
                <div className="container">
                    <h1>Organize Your Study Time</h1>

                    <p>
                        Keep your assignments and daily tasks
                        in one simple place.
                    </p>

                    <a href="#tasks" className="btn btn-light">
                        View My Tasks
                    </a>
                </div>
            </header>

            {/* Summary */}
            <section className="container my-4">
                <div className="row g-3 text-center">
                    <div className="col-md-6">
                        <div className="summary-card">
                            <h3>{tasks.length}</h3>
                            <p>Total Tasks</p>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="summary-card">
                            <h3>{completedCount}</h3>
                            <p>Completed Tasks</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Add Task */}
            <section className="container my-5" id="tasks">
                <h2 className="section-title text-center mb-4">
                    Manage Your Tasks
                </h2>

                <div className="form-card">
                    <form onSubmit={addTask}>
                        <div className="mb-3">
                            <label className="form-label">
                                Task Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your task"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Description
                            </label>

                            <textarea
                                className="form-control"
                                placeholder="Write a short description"
                                rows="3"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <button className="btn btn-primary">
                            Add Task
                        </button>
                    </form>
                </div>

                {message && (
                    <div className="alert alert-warning mt-3">
                        {message}
                    </div>
                )}

                {/* Task List */}
                <div className="row g-3 mt-3">
                    {loading ? (
                        <p className="text-center">Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <p className="text-center">
                            No tasks yet. Add your first task!
                        </p>
                    ) : (
                        tasks.map(task => (
                            <div className="col-md-6" key={task._id}>
                                <div className="task-card">
                                    <div className="d-flex justify-content-between gap-2">
                                        <h5 className={
                                            task.completed ? "completed" : ""
                                        }>
                                            {task.title}
                                        </h5>

                                        <span className={
                                            task.completed
                                                ? "badge bg-success"
                                                : "badge bg-warning text-dark"
                                        }>
                                            {task.completed
                                                ? "Completed"
                                                : "Pending"}
                                        </span>
                                    </div>

                                    <p>{task.description}</p>

                                    <button
                                        className="btn btn-sm btn-success me-2"
                                        onClick={() => completeTask(
                                            task._id,
                                            task.completed
                                        )}
                                    >
                                        {task.completed
                                            ? "Undo"
                                            : "Complete"}
                                    </button>

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteTask(task._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* About */}
            <section className="about-section text-center py-5" id="about">
                <div className="container">
                    <h2>About This Project</h2>

                    <p>
                        My Student Tasks is a simple task management
                        application developed using the MERN stack.
                        It helps students organize their daily work
                        and assignments.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer text-center">
                <p>© 2026 My Student Tasks</p>
                <p>Created by Payal Makani</p>
            </footer>
        </>
    );
}

export default App;
