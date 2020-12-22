const app = require("express")();
const PORT = process.env.PORT ? process.env.PORT : 3000;

app.get("/",(req,res)=>{
    res.send("Hello");
    res.end();
})

app.listen(PORT,()=>{
    console.log("Start");
})