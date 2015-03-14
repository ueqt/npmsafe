var path = require('path');
var fs = require('fs');

function CustomWhiteList() {

	var isWindows = process.platform === 'win32';
	var homePath = ( isWindows ? process.env.USERPROFILE
		: process.env.HOME
	);
	
	var configDir = path.resolve(homePath, '.npmsafe');
	try {
		fs.mkdirSync(configDir);
	} catch (e) {
		
	}

	this.whiteListFile = path.resolve(configDir, 'customWhiteList.txt');	
};

CustomWhiteList.prototype.load = function() {
	var data = '';	
	try {
		data = fs.readFileSync(this.whiteListFile);
	} catch (e) {
		
	}
	if(data.length>0) {
		data = data.slice(0, -2);
	}
	return JSON.parse('[' + data + ']');
};

CustomWhiteList.prototype.save = function(data) {
	try {
		fs.appendFileSync(this.whiteListFile, data);
	} catch (e)	{
		console.log('Warning: write custom white list file failed -- ', data);
	}
};

module.exports = new CustomWhiteList();

