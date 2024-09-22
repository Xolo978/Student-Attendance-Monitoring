"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = adminRoutes;
const adminHelper_js_1 = require("../helpers/adminHelper.js");
async function adminRoutes(fastify) {
    fastify.post('/admin-login', async (request, reply) => {
        console.log(request.body);
        const { username, password } = request.body;
        const result = await (0, adminHelper_js_1.adminLoginHelper)(username, password);
        if (result.success) {
            reply.send({ success: true });
        }
        else {
            reply.status(401).send({ success: false, message: 'Unauthorized' });
        }
    });
}
