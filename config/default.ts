require("dotenv").config();

export default {
  port: process.env.NODE_PORT,
  mongoUri: process.env.MONGO_URI_DEV,
  logLevel: "info",
  logs: "dev",
  env: process.env.NODE_ENV,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  sendgridApiKey: process.env.SENDGRID_API_KEY,

  redirectUrl: "http://localhost:3000",
  callBackUrl: "http://localhost:4000/api/auth/issuer/google/callback",

  clapi: "http://localhost:4040/api/core/webhook/business",
  reapi: "http://localhost:4050/api/core/webhook/business",
};
