const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description: 'A simple API to manage tasks'
        },
        servers: [{ url: 'http://localhost:3000' }]
    },
    apis: ['./app.js'],  // files containing annotations for the documentation
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let tasks = [];

// Create Task
app.post('/tasks', (req, res) => {
    const task = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,  // Add prioritization feature
        dueDate: req.body.dueDate     // Add due date feature
    };
    tasks.push(task);
    res.status(201).json(task);
});

// Read All Tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Update Task
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found');

    task.title = req.body.title;
    task.description = req.body.description;
    task.priority = req.body.priority;  // Update prioritization
    task.dueDate = req.body.dueDate;    // Update due date

    res.json(task);
});

// Delete Task
app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
    res.status(204).send();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
