const env = Deno.env.toObject();
const PORT = env.PORT || 8000;
const HOST = env.HOST || "localhost";
// cluster0-shard-00-01.uqu6c.mongodb.net
const DB_NAME = env.DB_NAME || "splus_api";
const DB_HOST = env.DB_HOST || "cluster0-shard-00-01.uqu6c.mongodb.net";
const DB_USERNAME = env.DB_USERNAME || "sergio";
const DB_PASSWORD = env.DB_PASSWORD || "";
const DB_URL = env.DB_URL || "mongodb://localhost:27017";
const FRONT_URL = env.FRONT_URL;

export {
  PORT,
  HOST,
  DB_NAME,
  DB_URL,
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  FRONT_URL,
};
