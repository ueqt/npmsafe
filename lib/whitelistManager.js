var https = require('https');
var async = require('async');
var whiteList = require('./whiteList');

function checkUpdate(cb) {
	async.waterfall([
		function (callbackMain) {
			console.log('Checking remote whitelist version...');
			callbackMain(null);
		},
		function (callbackMain) {
			var currentVersion = whiteList.getOfficialVersion();
			console.log(currentVersion);
			callbackMain(null);
		}
	], function (err) {
		if (err) {
			console.error(err);
		}
		cb(err);
	});
}


//
// API
//

exports.checkUpdate = checkUpdate;
