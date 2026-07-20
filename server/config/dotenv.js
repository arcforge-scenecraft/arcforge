import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const currentPath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentPath);

dotenv.config({ path: path.join(currentDir, "../.env") });
