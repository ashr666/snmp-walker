var snmp = require('snmp-native')
//http://stackoverflow.com/questions/14572006/net-snmp-returned-types
, typesRef = require('./dictionaries/typesHex') 
, oidsRef = require('./dictionaries/oids')
, deasync = require('deasync')
, child = require('child_process')
, exec = deasync(child.exec)
, express = require('express')
, fs = require('fs-extra')
, app = express();

app.use(express.static(__dirname + '/public'));

app.get('/snmp', function(req, res)  {

	var queryOid =  req.query.oid || '.1.3.6.1';
	var queryHost =  req.query.host || 'localhost';
	var queryCommunity =  req.query.community || 'public';

	var session = new snmp.Session({ 
		host: queryHost, 
		port: 161,
		community: queryCommunity 
	});
	
	if (req.query.get == 1) {

		// perform a SNMP GET
		session.get({ oid: queryOid }, function (err, varbinds) {
			if (err) { 
				console.error(err);
				res.status(500).send(err);
			} else {
				var vb = varbinds[0];
				// turn data to human readable
				vb.oidReadable = oidsRef['.' + vb.oid.join('.')];
				vb.typeReadable = typesRef[vb.type.toString(16)];

				var info = null;
				try {
					info = exec('snmptranslate -On -Td ' + queryOid);
					console.log(info);
				} catch (err) {
					console.log(err);
				}

				res.json({
					query : {
						oid : queryOid,
						oidReadable : oidsRef[queryOid]
					},
					info : info.replace(/(?:\r\n|\r|\n)/g, '<br />'),
					host : queryHost,
					community : queryCommunity,
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
				console.error(err);
				res.status(500).send(err);
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
					community : queryCommunity,
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
		translation = exec('snmptranslate ' + oid);
	}
	return translation;
}