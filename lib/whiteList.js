var path = require('path');
var fs = require('fs');
var osenv = require('osenv');

function WhiteList() {

	var configDir = path.resolve(osenv.home(), '.npmsafe');
	try {
		fs.mkdirSync(configDir);
	} catch (e) {

	}

	this.officialWhiteListVersion = path.resolve(configDir, 'version.json');
	this.officialWhiteListFile = path.resolve(configDir, 'whitelist.json');
	this.customWhiteListFile = path.resolve(configDir, 'customWhiteList.txt');

};

WhiteList.prototype.getOfficialVersion = function() {
	try {
		var version = require(this.officialWhiteListVersion);
		if (version == undefined) {
			return '0.0.0.0';
		} else {
			return version.version;
		}
	} catch (e) {
		return '0.0.0.0';
	}
};

WhiteList.prototype.loadOfficial = function() {
	try {
		return require(this.officialWhiteListFile);
	} catch (e) {
		console.error(e);
		return [];
	}
};

WhiteList.prototype.saveOfficial = function(versionData, whitelistData) {
	try {
		fs.writeSync(this.officialWhiteListFile, JSON.parse(whitelistData));
		fs.writeSync(this.officialWhiteListVersion, JSON.parse(versionData));
		return null;
	} catch (e) {
		return e;
	}
};

WhiteList.prototype.loadCustom = function() {
	var data = '';
	try {
		data = fs.readFileSync(this.customWhiteListFile);
	} catch (e) {

	}
	if(data.length>0) {
		data = data.slice(0, -2);
	}
	return JSON.parse('[' + data + ']');
};

WhiteList.prototype.saveCustom = function(data) {
	try {
		fs.appendFileSync(this.customWhiteListFile, data);
	} catch (e)	{
		console.log('Warning: write custom white list file failed -- ', data);
	}
};

module.exports = new WhiteList();

