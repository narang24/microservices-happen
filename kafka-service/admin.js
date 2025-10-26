import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: 'kafka-service',
    brokers: ['kafka-1:9092','kafka-2:9092','kafka-3:9092'] 
});

const admin = kafka.admin();

const run = async () => {
    await admin.connect();
    await admin.createTopics({
        topics: [{topic: 'auth-successful'},{topic: 'event-successful'},{topic: 'create-invitation'},{topic: 'update-status'},{topic: 'cron-job'}]
    });
}

run();