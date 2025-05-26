import express from "express";
import { config } from "./config/config.js";
import { router } from "./routes/index.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();

app.use(express.json({ limit: "20mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "..", "public")));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

if (!config.PORT) {
  console.error("PORT environment variable is not set.");
  process.exit(1);
}

app.use("/api", router);

// 404 Middleware
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Errors Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Algo salió mal",
      status,
    },
  });
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
