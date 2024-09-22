import { FastifyInstance } from 'fastify';
import User from '../model/User.js';

export default async function userRoutes(fastify: FastifyInstance) {
    fastify.post('/user-login', async (request, reply) => {
        const { userId, password } = request.body as { userId: string; password: string };

        try {
            const user = await User.findOne({ userId });
            if (!user || user.password !== password) { 
                return reply.status(401).send({ success: false, message: 'Invalid userId or password.' });
            }
            reply.send({ success: true, user });
        } catch (error) {
            reply.status(500).send({ success: false, message: 'Server error.' });
        }
    });
}
