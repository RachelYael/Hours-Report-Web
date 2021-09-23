const express = require('express');
const app = express();
const path= require('path');
app.use('/assets',express.static('assets'));

app.get('/',function(req,res){
	res.sendFile(path.resolve('./pages/WelcomePage.html'));
});

app.get('/Home', function(req,res){
    res.sendFile(path.resolve('./pages/VolunteerHomePage.html'));
});

app.get('/Login',function(req,res){
	res.sendFile(path.resolve('./pages/Login.html'));
});

app.get('/Register',function(req,res){
	res.sendFile(path.resolve('./pages/Register.html'));
});

app.listen(3000, function(){
	console.log('Server listen to port: 3000');
});