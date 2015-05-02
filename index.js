var snmp = require('snmp-native')
//http://stackoverflow.com/questions/14572006/net-snmp-returned-types
, typesRef = require('./dictionaries/typesHex') 
, oidsRef = require('./dictionaries/oids')
, exec = require('child_process').exec
, express = require('express')
, fs = require('fs-extra')
, app = express();

app.use(express.static(__dirname + '/public'));

app.get('/walk', function(req, res)  {

	var queryOid =  req.query.oid || '.1.3.6.1';
	var queryHost =  req.query.host || 'localhost';

	var session = new snmp.Session({ 
		host: 'localhost', 
		port: 161,
		community: 'public' 
	});
	
	if (req.query.get == 1) {

		// perform a SNMP GET
		session.get({ oid: queryOid }, function (err, varbinds) {
			if (err) { 
				throw err;
			} else {
				varbinds.forEach(function (vb) {
				// turn data to human readable
				vb.oidReadable = oidsRef['.' + vb.oid.join('.')];
				vb.typeReadable = typesRef[vb.type.toString(16)];
			});
				res.json({
					query : {
						oid : queryOid,
						oidReadable : oidsRef[queryOid]
					},
					host : queryHost,
					method : 'GET',
					walk : varbinds
				});
			}
			session.close();
		});

	} else {

		// perform a SNMP walk
		session.getSubtree({ oid: queryOid }, function (err, varbinds) {
			if (err) { 
				throw err;
			} else {
				varbinds.forEach(function (vb) {
				// turn data to human readable
				vb.oidReadable = translate(vb.oid);
				vb.typeReadable = typesRef[vb.type.toString(16)];
			});
				res.json({
					query : {
						oid : queryOid,
						oidReadable : oidsRef[queryOid]
					},
					host : queryHost,
					method : 'WALK',
					walk : varbinds
				});
			}
			session.close();
		});

	}
});

var server = app.listen(3000, function () {
	console.log('Example app listening at http://%s:%s', 
		server.address().address, 
		server.address().port);
});

function translate(vbOid) {
	var oid, dictionary, translation;
	oid = '.' + vbOid.join('.');
	translation = oidsRef[oid]
	if (!translation) {
		//dictionary = fs.readJsonSync('./dictionaries/oids.json');
		exec('snmptranslate ' + oid,
			function (error, stdout, stderr) {
				translation = stdout;
				//dictionary[oid] = translation;
				//fs.writeJsonSync('./dictionaries/oids.json', dictionary);
				//oidsRef = require('./dictionaries/oids'); //reload
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});
	}
	return translation;
}

function info(oid, cb) {
	exec('snmptranslate -On -Td -Ib' + oid,
		function (error, stdout, stderr) {
			if (error !== null)
				return console.log('exec error: ' + error);
			cb(stdout);
		});
}