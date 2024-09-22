import { FastifyInstance } from "fastify";
import { getSessionByIdHelper, saveSessionSettingsHelper, getSessionSettingsHelper, deleteSessionHelper } from "../helpers/sessionHelper";

export default async function sessionRoutes(fastify: FastifyInstance) {
    fastify.post("/save-session-settings", async (request, reply) => {
        const { date, startTime, endTime, sessionId } = request.body as {
            date: Date;
            startTime: string;
            endTime: string;
            sessionId: string;
        };
        await saveSessionSettingsHelper(new Date(date), startTime, endTime, sessionId);
        reply.send({ success: true });
    });

    fastify.get("/session-settings", async (request, reply) => {
        const settings = await getSessionSettingsHelper();
        reply.send(settings);
    });

    fastify.get("/session/:sessionId", async (request, reply) => {
        const { sessionId } = request.params as { sessionId: string };
        const session = await getSessionByIdHelper(sessionId);

        if (session) {
            reply.send(session);
        } else {
            reply.status(404).send({ success: false, message: "Session not found" });
        }
    });

    fastify.delete("/session-settings/:sessionId", async (request, reply) => {
        const { sessionId } = request.params as { sessionId: string };
        const success = await deleteSessionHelper(sessionId);

        if (success) {
            reply.send({ success: true, message: "Session deleted successfully" });
        } else {
            reply.status(404).send({ success: false, message: "Session not found" });
        }
    });
}
