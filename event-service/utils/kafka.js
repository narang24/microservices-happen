import { Kafka } from "kafkajs";
import { updateStatus } from "../controllers/eventContoller";

const kafka = new Kafka({
    clientId: 'event-service',
    brokers: ['localhost:9094','localhost:9095','localhost:9096']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId:'event-service' });

const connectToKafka = async () => {
    try {
        await producer.connect();
        console.log('Producer connected successfully');
    } catch(error) {
        console.log('Error connecting to Kafka', error);
    }
}

const produceData = async ({ topic, message }) => {
    try{
        await producer.send({
            topic,
            messages: [{value: JSON.stringify(message)}]
        })
    } catch(error) {
        console.log('Error producing data', error);
    }
}

const consumeData = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({
            topic: 'update-status',
            fromBeginning: true
        });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value.toString();
                const {id, accepted, email} = JSON.parse(value);
                updateStatus({ id, accepted, email });
            }
        })

    } catch(error) {
        console.log('Error consuming data', error);
    }
}

consumeData();

export { connectToKafka, produceData };
