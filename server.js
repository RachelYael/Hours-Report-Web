const express = require("express");
const app = express();
const path= require('path');
const fs = require('fs');

app.get('/Login', (req,res) => {
    res.sendFile(path.resolve("./pages/Login.html"));
});

app.get('/Register', (req,res) => {
    res.sendFile(path.resolve("./pages/Register.html"));
});

app.get("/",function(req,res){
    res.sendFile(path.resolve("./pages/WelcomePage.html"));
})


app.listen(3000, function(){
    console.log("Server listen to port: 3000");
});