import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootEnvPath = path.resolve(__dirname, "../../.env");

const result = dotenv.config({
  path: rootEnvPath,
});

if (result.error && process.env.NODE_ENV !== "production") {
  throw new Error(`Unable to load the root .env file: ${result.error.message}`);
}
