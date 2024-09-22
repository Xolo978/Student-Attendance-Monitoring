"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const mongoose_1 = __importDefault(require("mongoose"));
const adminRoutes_js_1 = __importDefault(require("./route/adminRoutes.js"));
const sessionRoutes_js_1 = __importDefault(require("./route/sessionRoutes.js"));
const attendanceRoutes_js_1 = __importDefault(require("./route/attendanceRoutes.js"));
const userWebsocket_js_1 = __importDefault(require("./websocket/userWebsocket.js"));
const userRoutes_js_1 = __importDefault(require("./route/userRoutes.js"));
const cors_1 = __importDefault(require("@fastify/cors"));
const config_json_1 = __importDefault(require("./config/config.json"));
const app = (0, fastify_1.default)();
const mongodbUri = config_json_1.default.mongoDbURI;
const port = config_json_1.default.port;
mongoose_1.default.connect(mongodbUri)
    .then(() => {
    console.log('MongoDB connected');
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
});
const startServer = async () => {
    await app.register(cors_1.default);
    await app.register(attendanceRoutes_js_1.default);
    await app.register(adminRoutes_js_1.default);
    await app.register(sessionRoutes_js_1.default);
    await app.register(userRoutes_js_1.default);
    await app.register(userWebsocket_js_1.default);
    app.listen({ port: port }, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening on http://localhost:${port}`);
    });
};
startServer().catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
});
