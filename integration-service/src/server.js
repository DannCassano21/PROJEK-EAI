require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { getState, startConsumer } = require("./rabbitmq");

const app = express();
const port = Number(process.env.INTEGRATION_PORT || 3004);

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  const state = getState();

  res.json({
    service: "integration-service",
    status: state.connected ? "UP" : "STARTING",
    integration: state
  });
});

app.listen(port, async () => {
  console.log(`Integration Service running on port ${port}`);

  try {
    await startConsumer();
  } catch (error) {
    console.error("Failed to start RabbitMQ consumer:", error);
  }
});
