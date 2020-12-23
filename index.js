const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const PORT = process.env.PORT ? process.env.PORT : 3000;

const app = express();

dotenv.config();
app.use("/", express.static("public/marzipano_3"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD
})
app.get("/",  (req,res)=>{
    res.sendFile(__dirname + "/public/marzipano_3/index.html");
})
app.listen(PORT,()=>{
    console.log("Start");
})