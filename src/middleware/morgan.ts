import type { Request } from "express";
import morgan from "morgan";

morgan.token("type", (req) => req.headers["content-type"]);
morgan.token("host", (req) => req.headers["host"]);
morgan.token("realIp", (req) => req.headers["x-real-ip"] as string);
morgan.token("body", (req) => JSON.stringify((req as Request).body));

export const BASE_FORMAT = ":host :realIp :type :method :url :status";
export const morganLogger = morgan(BASE_FORMAT);
export const morganLoggerWithBody = morgan(`${BASE_FORMAT} :body`);
