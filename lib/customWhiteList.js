var path = require('path');
var fs = require('fs');
var osenv = require('osenv');

function CustomWhiteList() {

	var configDir = path.resolve(osenv.home(), '.npmsafe');
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

