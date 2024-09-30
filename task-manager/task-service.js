const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const amqp = require('amqplib/callback_api');

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
        priority: req.body.priority,
        dueDate: req.body.dueDate
    };
    tasks.push(task);

    // Publish message to RabbitMQ
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) throw error0;
        connection.createChannel((error1, channel) => {
            if (error1) throw error1;

            const queue = 'taskQueue';
            const message = JSON.stringify(task);

            channel.assertQueue(queue, { durable: false });
            channel.sendToQueue(queue, Buffer.from(message));
        });
    });

    res.status(201).json(task);
});

// Other CRUD operations...

app.listen(4000, () => {
    console.log('Task service running on port 4000');
});
