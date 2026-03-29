require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const DB = process.env.MONGO_URL.replace(
  "<db_password>",
  process.env.DB_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log("DB connection succesfull");
});
app.listen(PORT, () => {
  console.log(`Listening to the server ${PORT}`);
});
