"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const User_js_1 = __importDefault(require("../model/User.js"));
async function userRoutes(fastify) {
    fastify.post('/user-login', async (request, reply) => {
        const { userId, password } = request.body;
        try {
            const user = await User_js_1.default.findOne({ userId });
            if (!user || user.password !== password) {
                return reply.status(401).send({ success: false, message: 'Invalid userId or password.' });
            }
            reply.send({ success: true, user });
        }
        catch (error) {
            reply.status(500).send({ success: false, message: 'Server error.' });
        }
    });
}
