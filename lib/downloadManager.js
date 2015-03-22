var https = require('https');

function downloadJson(url, cb) {
	https.get(url, function (res) {
		var body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function () {
			var realData = JSON.parse(body);
			cb(null, realData);
		});
	}).on('error', function (e) {
		cb(e);
	});
}


//
// API
//

exports.downloadJson = downloadJson;
