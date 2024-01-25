import express from "express";
import "express-async-errors";

import config from "config";
import compress from "compression";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";

const logs = config.get<string>("logs");
import { allowCompression } from "../helpers/compress";

import routes from "../routes/v1/index.routes";
import { NotFoundError } from "../errors/not-found-error";
import { errorHandler } from "../middlewares/errorHandler";

/**
 * Express instance
 * @public
 */

const app = express();

// parse body params and attache them to req.body
app.use(express.json());

// enable CORS - Cross Origin Resource Sharing
app.use(cors({ credentials: true, origin: true }));

// request logging. dev: console | production: file
app.use(morgan(logs));

// gzip compression
app.use(compress({ filter: allowCompression }));

// secure apps by setting various HTTP headers
app.use(helmet());

// mount api v1 routes
app.use("/", routes);

app.all("*", () => {
  throw new NotFoundError();
});

// Handle Application errors
app.use(errorHandler);

export default app;
