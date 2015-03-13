#!/usr/bin/env node
process.title = 'npmsafe';

var exec = require('child_process').exec;
var whitelist = require('./whitelist.json');

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
		console.log('no packages to install.');
		return;
	} 
	
	if(checkPackage(urls)) {
		// pass
		npmExecute(process.argv.slice(2).join(' '));
	} else {
		
	}
} else if(command === 'check') {
	// check package.json dependencies
	console.log('todo');
} else if(command === 'h' || command === 'help') {
	console.log('can just replace npm to npmsafe, support all npm function');
	console.log('nmpsafe command:');
	console.log('npmsafe check');
	console.log('');
	console.log('npm help:');
	npmExecute('help');
} else {
	npmExecute(process.argv.slice(2).join(' '));	
}

function npmExecute(params) {
	var child = exec('npm ' + params,
		function (error, stdout, stderr) {
			console.log(stdout);
			if(stderr !== null && stderr !== '') {
				console.log('stderr: ' + stderr);
			}
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});
}

function checkPackage(urls) {
	var strHttp = 'http';
	var strGithub = 'https://github.com/';
	var notVerifiedUrls = [];
	// read global whitelist
	for(var i = 0; i < urls.length; i++) {
		var url = urls[i];
		
		// check whitelist
		var found = false;
		for(var j = 0; j < whitelist.length; j++) {
			if(whitelist[j] === url) {
				found = true;
				break;
			}
		}
		if(!found) {
			notVerifiedUrls.push(url);
		}
		
		//if (url.length >= strHttp.length && url.substr(0, strHttp.length) === strHttp) {
		//	if (url.length >= strGithub.length && url.substr(0, strGithub.length) === strGithub) {
		//		// check github.com
		//	} else {
		//		// can not verify
		//		notVerifiedUrls.push(url);
		//	}
		//} else {
		//	// check npmjs.com
		//}
	}
	// TODO: read custom whitelist

	if(notVerifiedUrls.length > 0) {
		showVerifyFail(notVerifiedUrls);
	}
}

function showError() {
	console.error('\x1b[36m', Array.prototype.slice.call(arguments).join(''), '\x1b[0m');
}

function showVerifyFail(urls) {
	var result = false;
	showError('Not verified: ', urls.join(','));
	console.log('You can choose one choice:');
	console.log('[', '\x1b[36m', '1', '\x1b[0m', '].Stop(Default)');
	console.log('[', '\x1b[36m', '2', '\x1b[0m', '].Continue');
	console.log('[', '\x1b[36m', '3', '\x1b[0m', '].Continue and save to whitelist');
	console.log('Please input your choice:');
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.on('data', function(text) {
		if(text === '2\n') {
			result = true;
		} else if(text === '3\n') {
			result = true;
			// TODO:save to local whitelist
		} else {
			console.log('Stopped install ' + urls.join(','));
		}
		process.stdin.pause();
	});
	
	return result;
}

