import "./db";
import app from "./backend/app";

const PORT = 4000;

const handleListening = () =>
  console.log(`✔ Server running: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
