import { FastifyInstance } from 'fastify';
import websocketPlugin from '@fastify/websocket';

export default async function userWebsocket(fastify: FastifyInstance) {
    fastify.register(websocketPlugin);

    fastify.get('/user-ws', { websocket: true }, (connection, request) => {
        connection.socket.on('message', (message: string) => {
            console.log(`Received message: ${message}`);
        
        });
        connection.socket.send('Welcome to the websocket!');
    });
}
