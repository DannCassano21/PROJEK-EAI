const express = require('express');
const cors = require('cors');
const amqplib = require('amqplib');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

let channel, connection;

async function connectRabbitMQ() {
    try {
        connection = await amqplib.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertExchange('retail_events', 'topic', { durable: true });
        console.log("Terhubung ke RabbitMQ - Exchange 'retail_events' siap.");
    } catch (error) {
        console.error("Gagal terhubung ke RabbitMQ:", error);
    }
}

connectRabbitMQ();

app.use(cors());
app.use(express.json());

app.get('/sales', (req, res) => {
    res.json({ message: "POS Service is running! Ready to fetch sales data." });
});

app.post('/sales', (req, res) => {
    
    const eventPayload = {
        eventType: "sale.created",
        source: "pos-service",
        data: req.body 
    };

    try {
        if (channel) {
            channel.publish(
                'retail_events', 
                'sale.created', 
                Buffer.from(JSON.stringify(eventPayload))
            );
            console.log("Event 'sale.created' berhasil dipublish ke RabbitMQ");
            res.status(201).json({ message: "Sale transaction recorded and event published.", event: eventPayload });
        } else {
            res.status(500).json({ error: "RabbitMQ channel not ready" });
        }
    } catch (error) {
        console.error("Gagal publish event:", error);
        res.status(500).json({ error: "Gagal memproses transaksi" });
    }
});

app.listen(PORT, () => {
    console.log(`[pos-service] jalan di port ${PORT}`);
});