import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'auth-service',
    brokers: ['localhost:9094','localhost:9095','localhost:9096']
});

const producer = kafka.producer();

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

export { connectToKafka, produceData };
