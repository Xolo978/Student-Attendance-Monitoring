import { FastifyInstance } from 'fastify';
import { getAttendanceRecords, updateAttendance, incrementOrDecrementAttendance } from '../helpers/attendanceHelper.js';

export default async function attendanceRoutes(fastify: FastifyInstance) {
    // Existing routes
    fastify.get('/attendance', async (request, reply) => {
        const records = await getAttendanceRecords();
        return reply.status(200).send({records});
    });

    fastify.post('/attendance/update/:userId', async (request, reply) => {
        const { userId } = request.params as { userId: string };
        const { attended, sessionId } = request.body as { attended: boolean, sessionId: string };
        
        try {
            const { user, attendanceRecord, message } = await updateAttendance(userId, attended, sessionId);
            if (message) {
                return reply.status(200).send({ user, message, attendanceRecord });
            }
            return reply.status(201).send({ user, attendanceRecord });
        } catch (error) {
            return reply.status(404).send({ message: (error as Error).message });
        }
    });

    // New endpoint for increment/decrement
    fastify.post('/attendance/increment-decrement/:userId', async (request, reply) => {
        const { userId } = request.params as { userId: string };
        const { increment } = request.body as { increment: boolean };

        try {
            const updatedUser = await incrementOrDecrementAttendance(userId, increment);
            return reply.status(200).send({ user: updatedUser });
        } catch (error) {
            return reply.status(404).send({ message: (error as Error).message });
        }
    });
}
