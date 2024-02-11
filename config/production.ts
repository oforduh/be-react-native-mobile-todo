require("dotenv").config();

export default {
  port: process.env.NODE_PORT,
  mongoUri: process.env.MONGO_URI_LIVE,
  logLevel: "info",
  logs: "prod",
  env: process.env.NODE_ENV,
};
