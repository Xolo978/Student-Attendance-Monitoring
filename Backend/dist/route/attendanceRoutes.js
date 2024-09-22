"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = attendanceRoutes;
const attendanceHelper_js_1 = require("../helpers/attendanceHelper.js");
async function attendanceRoutes(fastify) {
    // Existing routes
    fastify.get('/attendance', async (request, reply) => {
        const records = await (0, attendanceHelper_js_1.getAttendanceRecords)();
        return reply.status(200).send({ records });
    });
    fastify.post('/attendance/update/:userId', async (request, reply) => {
        const { userId } = request.params;
        const { attended, sessionId } = request.body;
        try {
            const { user, attendanceRecord, message } = await (0, attendanceHelper_js_1.updateAttendance)(userId, attended, sessionId);
            if (message) {
                return reply.status(200).send({ user, message, attendanceRecord });
            }
            return reply.status(201).send({ user, attendanceRecord });
        }
        catch (error) {
            return reply.status(404).send({ message: error.message });
        }
    });
    // New endpoint for increment/decrement
    fastify.post('/attendance/increment-decrement/:userId', async (request, reply) => {
        const { userId } = request.params;
        const { increment } = request.body;
        try {
            const updatedUser = await (0, attendanceHelper_js_1.incrementOrDecrementAttendance)(userId, increment);
            return reply.status(200).send({ user: updatedUser });
        }
        catch (error) {
            return reply.status(404).send({ message: error.message });
        }
    });
}
