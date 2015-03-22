process.title = 'npmsafe';

var npmManager = require('./npmManager');
var whiteListManager = require('./whitelistManager');
var downloadManager = require('./downloadManager');
var path = require('path');
var async = require('async');

async.waterfall([
	function(callbackMain) {
		whiteListManager.checkUpdate(function(err) {
			callbackMain(err);
		})
	},
	function(callbackMain) {
		// parse command line
		var command = process.argv[2];
		if(command === 'i' || command === 'install') {
			var urls = [];
			for(var i = 3; i < process.argv.length;i++) {
				if(process.argv[i].substr(0,1) !== '-') {
					urls.push(process.argv[i]);
				}
			}
			if(urls.length <= 0) {
				// install directly
				npmManager.npmExecute('install');
				return;
			}

			checkPackage(urls, function(result) {
				if(result) {
					npmManager.npmExecute(process.argv.slice(2).join(' '));
				}
			});
		} else if(command === 'check') {
			// check package.json dependencies
			var packagejson = path.resolve(process.cwd(), 'package.json');
			console.log('Analysing ' + packagejson);
			try {
				var packageData = require(packagejson);
				var allDeps = [];
				if(packageData.dependencies != undefined) {
					allDeps = allDeps.concat(Object.keys(packageData.dependencies));
				}
				if(packageData.bundleDependencies != undefined) {
					allDeps = allDeps.concat(Object.keys(packageData.bundleDependencies));
				}
				if(packageData.devDependencies != undefined) {
					allDeps = allDeps.concat(Object.keys(packageData.devDependencies));
				}
				checkPackage(allDeps, function(result) {
					console.log('Your package.json is ', result ? 'safe.' : 'unsafe');
				});
			} catch (e) {
				console.error(e);
			}
		} else if(command === 'h' || command === 'help') {
			console.log('can just replace npm to npmsafe, support all npm function');
			console.log('nmpsafe command:');
			console.log('npmsafe check');
			console.log('');
			console.log('npm help:');
			npmManager.npmExecute('help');
		} else {
			npmManager.npmExecute(process.argv.slice(2).join(' '));
		}

		callbackMain(null);
	}
], function(err) {
	if(err)	{
		if(err === 'restart') {
			process.exit(0);
		} else {
			console.error(err);
		}
	}
});

function checkPackage(urls, cb) {
	var notVerifiedUrls = [];

	var totalWhiteList = whiteListManager.getWhiteLists();

	for(var i = 0; i < urls.length; i++) {
		var url = urls[i];
		// check whitelist
		var found = false;
		for(var j = 0; j < totalWhiteList.length; j++) {
			if(totalWhiteList[j] === url) {
				found = true;
				break;
			}
		}
		if(!found) {
			notVerifiedUrls.push(url);
		}
	}

	if(notVerifiedUrls.length > 0) {
		showVerifyFail(notVerifiedUrls, function(result) {
			cb(result);
		});
	} else {
		cb(true);
	}
}

function showError() {
	console.error('\x1b[36m', Array.prototype.slice.call(arguments).join(''), '\x1b[0m');
}

function autoSuggestion(url, cb) {
	// auto check npmjs.com and github.com
	var strHttp = 'http';
	var strGithub = 'https://github.com/';
	if (url.length >= strHttp.length && url.substr(0, strHttp.length) === strHttp) {
		if (url.length >= strGithub.length && url.substr(0, strGithub.length) === strGithub) {
			// TODO:check github.com
			cb('');
		} else {
			cb('');
		}
	} else {
		// check npmjs.com
		// get last month downloads from https://api.npmjs.org/downloads/point/last-month/npmsafe
		// reference:https://github.com/npm/download-counts
		downloadManager.downloadJson('https://api.npmjs.org/downloads/point/last-month/' + url, function(err, data) {
			if(err) {
				console.log("Got error: " + e);
				cb('');
			} else {
				cb(data.downloads);
			}
		});
	}
}

function showVerifyFail(urls, cb) {
	var result = false;
	showError('Not verified(package[downloads in npmjs in last month or stars in github(todo)]): ', urls.length);
	async.waterfall([
		function(callback) {
			async.eachLimit(urls, 5, function(url, eachcallback) {
				autoSuggestion(url, function(info) {
					console.log(url, '[', info, ']');
					eachcallback();
				});
			}, function(err) {
				if(err) {
					console.log('exception:', err);
				}
				callback(null);
			});
		},
		function(callback) {
			console.log('You can choose one choice:');
			console.log('[', '\x1b[36m', '1', '\x1b[0m', '].Stop(Default)');
			console.log('[', '\x1b[36m', '2', '\x1b[0m', '].Continue');
			console.log('[', '\x1b[36m', '3', '\x1b[0m', '].Continue and save to whitelist');
			console.log('Please input your choice:');
			process.stdin.resume();
			process.stdin.setEncoding('utf8');
			process.stdin.on('data', function(text) {
				if(text === '2\n' || text === '2\r' || text === '2\r\n') {
					result = true;
				} else if(text === '3\n' || text === '3\r' || text === '3\r\n') {
					result = true;
					// save to local whitelist
					whiteListManager.saveCustom('"' + urls.join('",\n"') + '",\n');
				} else {
					console.log('Stopped install ' + urls.join(','));
				}
				process.stdin.pause();

				cb(result);
			});
			callback(null);
		}
	], function(err) {

	});
}

