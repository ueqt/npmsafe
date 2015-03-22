var async = require('async');
var whiteList = require('./whiteList');
var downloadManager = require('./downloadManager');
var semver = require('semver');

function checkUpdate(cb) {
	async.waterfall([
		function (callbackMain) {
			console.log('Checking remote whitelist version...');
			downloadManager.downloadJson('https://raw.githubusercontent.com/ueqt/npmsafe/master/data/version.json', function(err, data) {
				if(err) {
					callbackMain(err);
				} else {
					callbackMain(null, data.version, data);
				}
			});
		},
		function (remoteVersion, remoteVersionData, callbackMain) {
			var localVersion = whiteList.getOfficialVersion();
			if(semver.lt(localVersion, remoteVersion)) {
				// need update
				console.log('Your whitelist version is ', localVersion, ',remote version is ', remoteVersion, ' updating to remote version...');
				callbackMain(null, true, remoteVersionData);
			} else {
				console.log('Your whitelist version is latest:', localVersion);
				callbackMain(null, false, remoteVersionData);
			}
		},
		function(needUpdate, remoteVersionData, callbackMain) {
			if(needUpdate) {
				downloadManager.downloadJson('https://raw.githubusercontent.com/ueqt/npmsafe/master/data/whitelist.json', function (err, data) {
					if (err) {
						callbackMain(err);
					} else {
						var resultErr = whiteList.saveOfficial(remoteVersionData, data);
						if(resultErr) {
							callbackMain(resultErr);
						} else {
							console.log('Updated to latest version.');
							callbackMain(null);
						}
					}
				});
			} else {
				callbackMain(null);
			}
		}
	], function (err) {
		if (err) {
			console.error(err);
		}
		cb(err);
	});
}

function getWhiteLists() {
	// read custom whitelist
	var customWhiteList = whiteList.loadCustom();
	var officialWhitelist = whiteList.loadOfficial();
	// concat global whitelist
	return officialWhitelist.concat(customWhiteList);
}


//
// API
//

exports.checkUpdate = checkUpdate;
exports.loadCustom = whiteList.loadCustom;
exports.saveCustom = whiteList.saveCustom;
exports.getWhiteLists = getWhiteLists;
