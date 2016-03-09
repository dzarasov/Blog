var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./dbconfigs/dbconfigs.js');
var methodOverride = require('method-override');
var multer = require('multer');


mongoose.connect(db.url);

app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.use(multer({ dest: './public/uploads',
 rename: function (fieldname, filename) {
    return filename;//+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));

app.get('/upload/:secret',function(req,res){
      if(req.params.secret == "digora"){
        res.sendfile('./public/uploader.html');
      }
      else{
        res.end('Xer tebe');
      }
      
});

app.post('/api/photo',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end("File uploaded.");
  }
});

require('./app/router.js')(app);
app.listen(process.env.PORT || 5000)
console.log('Listening on port '+process.env.PORT);
