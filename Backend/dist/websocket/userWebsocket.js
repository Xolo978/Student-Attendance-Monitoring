"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userWebsocket;
const websocket_1 = __importDefault(require("@fastify/websocket"));
async function userWebsocket(fastify) {
    fastify.register(websocket_1.default);
    fastify.get('/user-ws', { websocket: true }, (connection, request) => {
        connection.socket.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });
        connection.socket.send('Welcome to the websocket!');
    });
}
