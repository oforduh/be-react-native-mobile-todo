import logger from "pino";
import dayjs from "dayjs";
import config from "config";

const level = "info";

const log = logger({
  enabled: !!process.env.NOLOG,
  transport: {
    redact: ["password", "pin"],
    target: "pino-pretty",
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () =>
    `, "time": "${dayjs().format("ddd DD, MMMM YYYY-HH:mm:ss")}"`,
});

export default log;
