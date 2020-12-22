const app = require("express")();
const PORT = process.env.PORT ? porecesss.env.PORT : 3000;

app.get("/",(req,res)=>{
    res.send("Hello");
    res.end();
})

app.listen(()=>{
    console.log("Start");
})