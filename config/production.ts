require("dotenv").config();

export default {
  port: process.env.NODE_PORT,
  mongoUri: process.env.MONGO_URI_LIVE,
  logLevel: "info",
  logs: "prod",
  env: process.env.NODE_ENV,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  sendgridApiKey: process.env.SENDGRID_API_KEY,

  redirectUrl: "https://app.current.ng",
  callBackUrl: "https://auth.current.ng/api/auth/issuer/google/callback",

  clapi: "https://clapi.current.ng/api/core/webhook/business",
  reapi: "https://reapi.current.ng/api/core/webhook/business",
};
