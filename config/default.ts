require("dotenv").config();

export default {
  port: process.env.NODE_PORT,
  mongoUri: process.env.MONGO_URI_DEV,
  logLevel: "info",
  logs: "dev",
  env: process.env.NODE_ENV,
};
