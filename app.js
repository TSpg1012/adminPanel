const express = require("express");
const app = express();
const port = 3000;
const router = require("./router/router");

require("dotenv").config();
require("./DB/db");

app.use(express.json());
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});