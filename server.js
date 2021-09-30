const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const express = require('express');
const app = express();

app.set('view engine','ejs');
const path= require('path');
const { readFile } = require('fs');
const { Console } = require('console');

const UserModel = require(path.resolve('./models/User.js'));

// ATLAS!   mongodb+srv://cluster0.mnwq9.mongodb.net?retryWrites=true&w=majority
mongoose.connect(process.env.MONGO_URI,{
		// user:"demouser",
		// pass: "demopassword",
		dbName:'myapp',
		useNewUrlParser : true}).then(console.log("mongoose connected"));

//localhost!
// mongoose.connect('mongodb://root:example@localhost:27017/',{
// 		dbName:'myapp',
// 		useNewUrlParser : true}).then(console.log("mongoose connected"));

app.use('/assets',express.static('assets'));
app.use(bodyParser.urlencoded({extended:true}));


var USERNAME ="";
app.get('/',function(req,res){
	res.sendFile(path.resolve('./pages/WelcomePage.html'));
});
app.get('/Error', function(req,res){
    res.sendFile(path.resolve('./pages/Error.html'));
});

app.get('/AddHoursError', function(req,res){
    res.sendFile(path.resolve('./pages/ErrorField.html'));
});

app.get('/AddHours', function(req,res){

	res.sendFile(path.resolve('./pages/AddHoursPage.html'));
});

app.post('/AddHours',async function(req,res){
	var addedHours = req.body.hours||0;
	var user = await UserModel.findOne({username:USERNAME});
	if(!user){
		console.log("error in USERNAME!")
		res.sendFile(path.resolve('./pages/ErrorField.html'));

	}
	if(addedHours > (parseInt(user.totalHours)- parseInt(user.hoursDone)) || parseInt(addedHours)<0 || isNaN(addedHours)){
		console.log("error - hours added is more than hours left");
		res.redirect('/AddHoursError');
	}else{
		var actualHours = parseInt(user.hoursDone)+parseInt(addedHours);
		var leftHours = parseInt(user.totalHours) - actualHours;
		var money = (parseFloat(user.totalMoney)/parseFloat(user.totalHours))* actualHours;
	
		await UserModel.updateOne({username:USERNAME},{hoursDone:actualHours});
	
		res.render("HomePage",{NameMarker:user.username,DoneHoursMarker:actualHours,LeftHourMarker:leftHours,MoneyMarker:money});
	}

});

app.get('/Home',function(req,res){
	res.sendFile(path.resolve('./pages/VolunteerHomePage.html'));});
app.post('/Home', async function(req,res){
});

app.get('/Login',function(req,res){
	res.sendFile(path.resolve('./pages/Login.html'));
});
app.post('/Login',async function(req,res){
    var username = req.body.Username;
    var password = req.body.Password;
    if(username ===""||password==="")
	{
		res.sendFile(path.resolve('./pages/LoginFieldsError.html'));
	}
    try{
        const user = await UserModel.findOne({username:username, password:password});
        if(!user){
            throw new Error('Wrong details');
        }
		let moneyPerHour = parseFloat(user.totalMoney)/parseFloat(user.totalHours);
		var Dhours =parseFloat(user.hoursDone)||0;
		var money =moneyPerHour*Dhours ;
		var leftHour = parseFloat(user.totalHours) - Dhours;
		USERNAME = username;
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
            res.redirect('/Error');
			throw new Error('This username: '+username+' already taken!\nPlease try somthing else.');
        }else{
            const newUser = await UserModel.create({username,password,totalHours,totalMoney, hoursDone:"0"});
        }
	}
	catch(error){
		console.log("ERROR!\n"+error);
		res.sendFile(path.resolve('./pages/Error.html'));
	}
	var Dhours =0;
	var money =0 ;
	USERNAME = username;
	res.render("HomePage",{NameMarker:username,DoneHoursMarker:Dhours,LeftHourMarker:totalHours,MoneyMarker:money});
});

app.post('/Error',function(req,res){
	res.redirect('/Register');
});

app.post('/LoginError',function(req,res){
	res.redirect('/Login');
});

app.post('/LoginFieldsError',function(req,res){
	res.redirect('/Login');
});

app.post('/RegisterError',function(req,res){
	res.redirect('/Register');
});


app.post('/AddHoursError',function(req,res){
	res.redirect('/AddHours');
});

const myPORT = process.env.PORT || 3000;
app.listen(myPORT, function(){
	console.log('Server listen to port:'+myPORT);
});