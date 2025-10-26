import express from "express";
import { Kafka } from "kafkajs";

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}))

const kafka = new Kafka({
    clientId: 'status-service',
    brokers: ['localhost:9094','localhost:9095','localhost:9096']
});

const producer = kafka.producer();

const connectToKafka = async () => {
    try {
        await producer.connect();
        console.log('Producer connected to Kafka');
    } catch(error) {
        console.log('Error connecting to Kafka', error);
    }
}

app.get('/get-event/:id/status', async (req, res) => {
    const { id } = req.params;
    const { accepted, email } = req.query;

    if(!email) return res.status(400).json({ message: 'Email is required' });

    await producer.send({
        topic: 'update-status',
        messages: [{value: JSON.stringify({id, accepted, email})}]
    });

});

app.use((err, req, res, next) => res.status(err.status || 500).send(err.message));

app.listen(8003, () => {
    connectToKafka();
    console.log('Status-Service running on port 8003')
});