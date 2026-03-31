const cors = require("cors");
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const globalErrorHandler = require("./controllers/errorController");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello");
});
//mounted routes

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/conversations", conversationRoutes);

app.use(globalErrorHandler);
module.exports = app;
