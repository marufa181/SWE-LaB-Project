import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server Running Successfully 🚀");
});

export default app;   // --- THIS IS REQUIRED
