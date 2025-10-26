import { Kafka } from "kafkajs";
import Invitation from "../models/Invitation";
import { updateInvitation } from "../controllers/invitationController";

const kafka = new Kafka({
    clientId: 'invitation-service',
    brokers: ['kafka-1:9092','kafka-2:9092','kafka-3:9092'] 
});

const consumer = kafka.consumer({ groupId: 'invitation-service'});

const run = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({
            topics: ['create-invitation','update-status'],
            fromBeginning: true
        });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                switch(topic) {
                    case 'create-invitation':
                    {
                        const value = message.value.toString();
                        const { user, event, participant } = JSON.parse(value);

                        if(user && event && participant) {
                            await Invitation.create({
                                eventId: event._id,
                                inviteeId: user._id,
                                inviterId: event.userId,
                                status: participant.status,
                                date: event.date,
                            });
                        } 
                    }
                    break;

                    case 'update-status': 
                    {
                        const value = message.value.toString();
                        const {id, accepted, email} = JSON.parse(value);
                        updateInvitation({id, accepted, email});
                    }
                    break;
                }
            }
        })
    } catch(error) {
        console.log('Error connecting consumer', error);
    }
};

export default run;