require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const { setSocket } = require("./socket");

const PORT = process.env.PORT || 5000;

// DB connection
const DB = process.env.MONGO_URL.replace(
  "<db_password>",
  process.env.DB_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});
const server = http.createServer(app);
//initilaize socket
setSocket(server);
// 🔥 Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
