var Schema = require('./models/Schema.js');
var UserS = require('./models/UserS.js');

module.exports = function(app){



	app.get('/api/supersecretkey/blogdata', function(req, res){
		Schema.find(function(err, data){
			if(err){
				throw err
			}
			else{
				res.json(data);
			}
		})
	});

	app.post('/api/supersecretkey/blogdata', function(req, res){


					if(req.body.passw == "secret"){

		Schema.create({
			textE: req.body.textE,
			done: false,
			imageS: req.body.imageS,
			imageBucket: req.body.imageBucket,
			videoUrl: req.body.videoUrl,
			date: new Date(),
			latlon:req.body.latlon			
		}, function(err, data){
			if(err){
				throw err;
			}
			else{
				Schema.find(function(err, data){
					if(err){
						throw err;
					}
					else{
						res.json(data);
					}
				})
			}
		})





						
					}
					else{
						res.end("No Persmisions to add data")
					}







//backToUserCTRL	



	});






	app.get('/api/supersecretkey/blogdata/:id', function(req, res){
		
		Schema.findOne({_id: req.params.id}, function(err,data) { 
			if(err){
				res.end("Sorry this post not found, please let us know about this problem and will try to fix it")
			}
			res.json(data); 
		});
	})


	app.delete('/api/supersecretkey/blogdata/:id', function(req, res){
		Schema.remove({
			_id: req.params.id
		}, function(err, data){
			if(err){
				throw err;
			}
			else{
				Schema.find(function(err, data){
					if(err){
						throw err;
					}
					else{
						res.json(data);
					}
				})
			}
		})
	});

	app.get('/', function(req, res){
		res.sendfile('./public/index.html');
	})

}