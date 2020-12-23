const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const PORT = process.env.PORT ? process.env.PORT : 3000;

const app = express();

dotenv.config();
app.use("/", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD
})
app.get("/",  (req,res)=>{
    // pool.getConnection((error , conn)=>{
    //     if(error) console.error(error);
    //     const str = "select * from user"; 
    //     conn.query(str,(error,result)=>{
    //         if(error) throw error;
    //         console.log(result)
    //         res.write(`<h1>${result[0].id}${result[0].age}${result[0].name}${result[0].description}고객</h1>`)
    //         res.end()
    //         //res.status(200).send(`<h1>${result[0].id}${result[0].age}${result[0].name}${result[0].description}고객</h1>`)
    //         conn.release();
    //     })
    // })
    res.sendFile(__dirname + "/public/index.html");
})
app.listen(PORT,()=>{
    console.log("Start");
})