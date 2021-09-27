const mongoose = require('mongoose');

const User = mongoose.model('User',{
	username:{
		type:String,
		require:true,
		unique:true
	},
	password:{
		type:String,
		require:true
	},
	totalHours:{
		type:String,
		require:true
	},
	totalMoney:{
		type:String,
		require:true
	},
	hoursDone:{
		type:String
	}

});

module.exports =User;
