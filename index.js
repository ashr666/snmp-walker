var snmp = require('snmp-native')
, express = require('express')
, app = express();

app.use(express.static(__dirname + '/public'));

app.get('/walk', function(req, res)  {

	var session = new snmp.Session({ 
		host: 'localhost', 
		port: 161,
		community: 'public' 
	});

	// perform a SNMP walk
	session.getSubtree({ oid: '.1.3.6.1.2.1' }, function (err, varbinds) {
		if (err) { 
			console.log(err);
		} else {
			varbinds.forEach(function (vb) {
				console.dir(vb);
			});
		}
		res.json(varbinds);
		session.close();
	});

});

var server = app.listen(3000, function () {
  console.log('Example app listening at http://%s:%s', 
  	server.address().address, 
  	server.address().port);
});

