
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((error) => console.log(error));

// Task Schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

// Home route
app.get("/", (req, res) => {
    res.send("Student Task Manager API is running");
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

// Add new task
app.post("/api/tasks", async (req, res) => {
    try {
        if (!req.body.title || !req.body.title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            title: req.body.title.trim(),
            description: req.body.description || ""
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error adding task" });
    }
});

// Update task status
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { completed: req.body.completed },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: "Invalid task ID" });
    }
});

// Delete task
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Invalid task ID" });
    }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
