const env = Deno.env.toObject();
const PORT = env.PORT || 8000;
const HOST = env.HOST || "localhost";
const DB_NAME = env.DB_NAME || "splus_api";
const DB_URL = env.DB_URL || "mongodb://localhost:27017";
const FRONT_PORT = env.FRONT_PORT || 4200;

export { PORT, HOST, DB_NAME, DB_URL };
