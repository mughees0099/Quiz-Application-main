const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const mongoose = require("mongoose");
const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const resportsRoute = require("./routes/reportsRoute");
const cors = require("cors");
const bodyParser = require("body-parser");

const DBURL = process.env.MONGO_URL;
mongoose
  .connect(DBURL)
  .then(() => {
    console.log("Mongo Db Connection Successful");
  })
  .catch((err) => {
    console.log("Mongo Db Connection Failed");
  });
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", usersRoute);
app.use("/api/exams", examsRoute);
app.use("/api/reports", resportsRoute);
const port = process.env.PORT || 5000;

const path = require("path");

__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
