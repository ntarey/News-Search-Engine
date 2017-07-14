var express = require('express');
var solr = require('solr-client');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var parse = require('csv-parse');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

var http = require('http').Server(app);

http.listen(3000, function(err){
    if(err){
        console.log("Error starting http server");
        return;
    }
    console.log("Http server running on port 3000");
});

app.use(express.static(path.join(__dirname, '.')));

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/HW4.html');
});

var client = solr.createClient({
	host : 'localhost',
	port : 8983,
	core : 'myexample',
});

app.get('/query', function(req, res){
  var query = client.createQuery();
  query.q(req.query.q);

  if(req.query.sort == "pagerank"){
    query.sort( {pageRankFile : 'desc'});
  }
  client.search( query, function ( err, obj ) {
	if ( err ) {
		console.log( err );
	} else {
		console.log( obj );
    res.send(obj.response);
	}
});
});

app.get('/suggestion',function(req, res){
  var query = client.createQuery();
  query.q(req.query.q);
  query.prototype.qt('/suggest');
  client.search( query, function ( err, obj ) {
	if ( err ) {
		console.log( err );
	} else {
		console.log( obj );
    res.send(obj.response);
	}
});
}
);

app.get('/getsnippet', function(req,res){
  var id = req.query.id;
  console.log(id);
  res.send(id);
});

app.get('/getmap', function(req, res) {
    var csvData = [];
    fs.createReadStream("mapLATimesDataFile.csv")
        .pipe(parse({delimiter: ',', relax_column_count: true}))
        .on('data', function(csvrow) {
            csvData.push(csvrow);
        })
        .on('end',function() {
          res.contentType('application/json');
          res.send(JSON.stringify(csvData));
        });
      });
