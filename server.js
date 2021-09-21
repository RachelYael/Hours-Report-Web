const express = require('express');
const app = express();
const path= require('path');


app.get('/',function(req,res){
	res.sendFile(path.resolve('./pages/WelcomePage.html'));
});


app.listen(3000, function(){
	console.log('Server listen to port: 3000');
});