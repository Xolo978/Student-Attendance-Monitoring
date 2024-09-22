import fastify from 'fastify';
import mongoose from 'mongoose';
import adminRoutes from './route/adminRoutes.js';
import sessionRoutes from './route/sessionRoutes.js';
import attendanceRoutes from './route/attendanceRoutes.js';
import userWebsocket from './websocket/userWebsocket.js';
import userRoutes from './route/userRoutes.js';
import cors from '@fastify/cors'
import config from "./config/config.json"
const app = fastify();
const mongodbUri = config.mongoDbURI
const port = config.port

mongoose.connect(mongodbUri)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });


const startServer = async () => {
    await app.register(cors)
    await app.register(attendanceRoutes);
    await app.register(adminRoutes);
    await app.register(sessionRoutes);
    await app.register(userRoutes)
    await app.register(userWebsocket); 

    app.listen({ port: port }, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening on http://localhost:${port}`);
    });
};

startServer().catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
});
