import { FastifyInstance } from 'fastify';
import { adminLoginHelper } from '../helpers/adminHelper.js';

export default async function adminRoutes(fastify: FastifyInstance) {
    fastify.post('/admin-login', async (request, reply) => {
        console.log(request.body)
        const { username, password } = request.body as { username: string; password: string };
        const result = await adminLoginHelper(username, password);
        if (result.success) {
            reply.send({ success: true });
        } else {
            reply.status(401).send({ success: false, message: 'Unauthorized' });
        }
    });
}
