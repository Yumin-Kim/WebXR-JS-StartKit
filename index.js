const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const PORT = process.env.PORT ? process.env.PORT : 3000;

const app = express();

dotenv.config();

app.use("/", express.static("public/examples"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
function handleDisconnect() {
  conn.connect(function (err) {
    if (err) {
      console.log("error when connecting to conn:", err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  conn.on("error", function (err) {
    console.log("conn error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      return handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();
const insertSQL =
  "INSERT INTO `heroku_4f519a792970c53`.`user` (`user_id`, `name`, `passwd`, `access_code`, `dept`, `sub_dept`, `phone_number`) VALUES ('2', 'qwe', '123', '1', '123', '123', '123123')";
app.post("/login", (req, res) => {
  const data = req.body;
  const parseData = Object.values(JSON.parse(data.json)).reduce(
    (prev, cur, index) => {
      prev.push(cur);
      return prev;
    },
    []
  );
  conn.query(insertSQL, parseData, (error, row, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(row);
      console.log(fields);
      res.json({ operation: "sucess" });
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/examples/physics/index.html");
});
app.listen(PORT, () => {
  console.log("Start");
});
