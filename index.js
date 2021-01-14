const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const PORT = process.env.PORT ? process.env.PORT : 3000;

const app = express();

dotenv.config();

app.use("/", express.static("public/aframe-blink-teleportation"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     database:process.env.DB_DATABASE,
//     user : process.env.DB_USERNAME,
//     password : process.env.DB_PASSWORD
// })

app.get("/",  (req,res)=>{
    res.sendFile(__dirname + "/public/aframe-blink-teleportation/index.html");
})
app.listen(PORT,()=>{
    console.log("Start");
})