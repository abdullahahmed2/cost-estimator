const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

const app = express();
app.use(bodyParser.json());

amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) throw error0;
    connection.createChannel((error1, channel) => {
        if (error1) throw error1;

        const queue = 'taskQueue';

        channel.assertQueue(queue, { durable: false });
        console.log('Waiting for messages in %s', queue);

        channel.consume(queue, (msg) => {
            const task = JSON.parse(msg.content.toString());
            console.log('Received task:', task);

            // Send notification logic (e.g., email or SMS notifications)
            console.log(`Sending notification for task: ${task.title}`);
        }, { noAck: true });
    });
});

app.listen(5000, () => {
    console.log('Notification service running on port 5000');
});
