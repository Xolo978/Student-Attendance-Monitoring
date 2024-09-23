import { FastifyInstance } from 'fastify';
export default async function dummyRoutes(fastify: FastifyInstance) {
    fastify.get('/', async (request, reply) => {
        return reply.status(200).send({ message: 'Hello from dummy route' });
    });
}