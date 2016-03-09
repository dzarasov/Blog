var mongoose = require('mongoose');

module.exports = mongoose.model('Schema', {
	textE: String,
	done: Boolean,
	imageS: String,
	imageBucket: String,
	videoUrl:String, 
	date: Date,
	latlon:String
})