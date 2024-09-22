"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sessionRoutes;
const sessionHelper_1 = require("../helpers/sessionHelper");
async function sessionRoutes(fastify) {
    fastify.post("/save-session-settings", async (request, reply) => {
        const { date, startTime, endTime, sessionId } = request.body;
        await (0, sessionHelper_1.saveSessionSettingsHelper)(new Date(date), startTime, endTime, sessionId);
        reply.send({ success: true });
    });
    fastify.get("/session-settings", async (request, reply) => {
        const settings = await (0, sessionHelper_1.getSessionSettingsHelper)();
        reply.send(settings);
    });
    fastify.get("/session/:sessionId", async (request, reply) => {
        const { sessionId } = request.params;
        const session = await (0, sessionHelper_1.getSessionByIdHelper)(sessionId);
        if (session) {
            reply.send(session);
        }
        else {
            reply.status(404).send({ success: false, message: "Session not found" });
        }
    });
    fastify.delete("/session-settings/:sessionId", async (request, reply) => {
        const { sessionId } = request.params;
        const success = await (0, sessionHelper_1.deleteSessionHelper)(sessionId);
        if (success) {
            reply.send({ success: true, message: "Session deleted successfully" });
        }
        else {
            reply.status(404).send({ success: false, message: "Session not found" });
        }
    });
}
