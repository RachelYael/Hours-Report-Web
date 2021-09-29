const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const express = require('express');
const app = express();

app.set('view engine','ejs');
const path= require('path');
const { readFile } = require('fs');
const { Console } = require('console');

const UserModel = require(path.resolve('./models/User.js'));

mongoose.connect('mongodb://root:example@localhost:27017/',{
		dbName:'myapp',
		useNewUrlParser : true}).then(console.log("mongoose connected"));

app.use('/assets',express.static('assets'));
app.use(bodyParser.urlencoded({extended:true}));


app.get('/',function(req,res){
	res.sendFile(path.resolve('./pages/WelcomePage.html'));
});

app.get('/AddHours', function(req,res){
	res.sendFile(path.resolve('./pages/AddHoursPage.html'));
});


app.get('/Home',async function(req,res){
	res.sendFile(path.resolve('./pages/VolunteerHomePage.html'));
});

app.post('/Home', async function(req,res){
	//TODO: dispaly user's data
});

app.get('/Login',function(req,res){
	res.sendFile(path.resolve('./pages/Login.html'));
});
app.post('/Login',async function(req,res){
    var username = req.body.Username;
    var password = req.body.Password;
    try{
        const user = await UserModel.findOne({username:username, password:password});
        if(!user){
            throw new Error('Wrong details');
        }
		let moneyPerHour = parseFloat(user.totalMoney)/parseFloat(user.totalHours);
		var Dhours =parseFloat(user.hoursDone)||0;
		var money =moneyPerHour*Dhours ;
		var leftHour = parseFloat(user.totalHours) - Dhours;
		res.render("HomePage",{NameMarker:username,DoneHoursMarker:Dhours,LeftHourMarker:leftHour,MoneyMarker:money});
    }catch(error){
        console.log("login faild\n" + error);
		res.sendFile(path.resolve('./pages/LoginError.html'));
    }

    
});

app.get('/Register',function(req,res){
	res.sendFile(path.resolve('./pages/Register.html'));
});

app.post('/Register',async function(req,res){
	var username = req.body.Username;
	var password = req.body.Password;
	var totalHours = req.body.Hours;
	var totalMoney = req.body.Money;

	if(username ===""||password===""||totalHours==="" || totalMoney==""||isNaN(totalMoney)||isNaN(totalHours))
	{
		res.sendFile(path.resolve('./pages/RegisterError.html'));
	}
	try{
		const user = await UserModel.findOne({username:username});
		if(user){
			throw new Error('This username: '+username+' already taken!\nPlease try somthing else.');
		}
		const newUser = await UserModel.create({username,password,totalHours,totalMoney, hoursDone:"0"});
	}
	catch(error){
		console.log("ERROR!\n"+error);
		res.sendFile(path.resolve('./pages/Error.html'));
	}
	var Dhours =0;
	var money =0 ;
	res.render("HomePage",{NameMarker:username,DoneHoursMarker:Dhours,LeftHourMarker:totalHours,MoneyMarker:money});
});

app.post('/Error',function(req,res){
	res.redirect('/Register');
});

app.post('/LoginError',function(req,res){
	res.redirect('/Login');
});

app.post('/RegisterError',function(req,res){
	res.redirect('/Register');
});

const myPORT = process.env.PORT || 3000;
app.listen(myPORT, function(){
	console.log('Server listen to port:'+myPORT);
});