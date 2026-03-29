const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

//mounted routes

app.use("/api/v1/user", userRoutes);
module.exports = app;
