const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: `${__dirname}/config.env` });
const app = require("./app");
process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});
const port = process.env.PORT || 2000;
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));
const server = app.listen(port, "127.0.0.1", () => {
  console.log(`you are currently logged in ${port}`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
