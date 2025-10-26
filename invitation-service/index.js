import express from "express";
import mongoose from "mongoose";
import run from "./utils/kafka";
import invitationRoutes from './routes/invitationRoutes'

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('MongoDB connected successfully');
    } catch(error) {
        console.log('Error connecting to MongoDB', error);
        process.exit(1);
    }
}

connectDB();

app.use('/api/invitation',invitationRoutes);

app.use((err, req, res, next) => res.status(err.status || 500).send(err.message));

app.listen(8002,() => {
    run();
    console.log('Invitation Service running on port 8002');
})