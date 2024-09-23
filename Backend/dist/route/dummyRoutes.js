"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = dummyRoutes;
async function dummyRoutes(fastify) {
    fastify.get('/', async (request, reply) => {
        return reply.status(200).send({ message: 'Hello from dummy route' });
    });
}
