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
setInterval(function () {
  conn.query('SELECT 1');
}, 5000);
// pool.connect()
// console.log(pool.query("select * from user"))
const insertSQL =
  "INSERT INTO user (user_id, name, passwd, access_code, dept, sub_dept, phone_number) VALUES (?, ?, ?, 3, ?, ?, ?)";
app.post("/signup", async (req, res) => {
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
});
app.post("/dropuser",(req,res)=>{
    const data =req.body
    const parseData = JSON.parse(data.json)
    conn.query(`select * from user where user_id=${parseData.user_id}`,(error,row)=>{
      console.log(row);
      if(row !== undefined){
        if(row.length === 0 ){
          res.json({operation:"failure"})
        }else{
          conn.query(`delete from user where user_id=${parseData.user_id}`,(error,row)=>{
            res.json({operation:"sucess"})
          })
        }
      }else{
        res.json({operation:"failure"})
      }
    })
})

app.post("/login",(req,res)=>{
  const data =req.body
  const parseData = JSON.parse(data.json)
  conn.query(`select * from user where user_id=${parseData.user_id} and passwd=${parseData.pwd}`,(error,row)=>{
    if(row !== undefined){
      if(row.length === 0 ){
        res.json({login:"NO"})
      }else{
          res.json({login:"YES",user_id:row[0].user_id,user_name:row[0].name})
      }
    }else{
      res.json({login:"NO"})
    }
  })
})
app.post("/logout",(req,res)=>{
  res.send("clear")
})
app.post("/changepassword",(req,res)=>{
  const data =req.body
  const parseData = JSON.parse(data.json)
  console.log(parseData);
  conn.query(`select * from user where user_id=${parseData.user_id} and passwd=${parseData.pwd}`,(error,row)=>{
    if(row !== undefined){
      if(row.length === 0 ){
        res.json({operation : "failure"})
      }else{
        conn.query(`update user set passwd=${parseData.newpwd} where user_id=${parseData.user_id}`,(error,row)=>{
          res.json({operation : "sucess"})
        })
      }
    }else{
      res.json({operation : "failure"})
    }
  })
})
app.get("/",  (req,res)=>{
    res.sendFile(__dirname + "/public/examples/physics/index.html");
})
app.listen(PORT,()=>{
    console.log("Start");
})
