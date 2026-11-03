import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

export function customHeader(req, res, next) {
  const { name } = req.query;
  res.setHeader("X-Powered-By-Student", "Osato-Amayo"); //The name that should be displayed in the header should be the name of the student that made the reqest. For example, if the student is John Doe, the header should be X-Powered-By-John-Doe. but it will be checked.

  next();
}

export async function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logFilePath = path.join(__dirname, "urlInfo.log");

  const urlInfo = `${timestamp} ${req.method} ${req.originalUrl}\n`;

  // console.log(urlInfo.trim()); // check for the reason for trimming here

  try {
    await fs.appendFile(logFilePath, urlInfo, "utf8");
    next();
  } catch (error) {
    next(error);
  }
}
