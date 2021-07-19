import dotenv from "dotenv";
import "./backend/db";
import app from "./backend/app";

dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✔ Server running: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
