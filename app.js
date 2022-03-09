const express = require("express");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routes = require("./src/routes");
app.use("/", routes);

app.listen(3000, () => {
  console.log("server started at port 3000");
});
