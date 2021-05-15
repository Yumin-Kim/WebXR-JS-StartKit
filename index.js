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
    database:process.env.DB_DATABASE,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD
})

// pool.connect()
// console.log(pool.query("select * from user"))
const insertSQL =
  "INSERT INTO user (user_id, name, passwd, access_code, dept, sub_dept, phone_number) VALUES (?, ?, ?, 3, ?, ?, ?)";
app.post("/login", async (req, res) => {
  const data = req.body;
  const parseData = Object.values(JSON.parse(data.json)).reduce(
    (prev, cur, index) => {
      prev.push(cur);
      return prev;
    },
    []
  );
  console.log(parseData);
  await conn.query(insertSQL, parseData, (error, row, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(row);
      console.log(fields);
      res.json({ operation: "sucess" });
    }
  });
  await conn.end();
});
app.post("/logout",(req,res)=>{
    const data =req.body

    console.log(JSON.parse(data.json))

    res.json({operation:"sucess"})
})
app.get("/",  (req,res)=>{
    res.sendFile(__dirname + "/public/examples/physics/index.html");
})
app.listen(PORT,()=>{
    console.log("Start");
})
