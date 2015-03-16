var npm = require('npm');
var spawn = require('win-spawn');

var npmIsInitialized = false;

/**
 * Initialize the version manager
 * @param callback Called when done
 */
function initialize(callback) {
	npm.load({}, function () {
		npmIsInitialized = true;
		callback();
	});
}

/**
 * Run npm
 * @param command
 * @param callback
 * @param can use arguments to input other arguments
 */
function run(command, callback) {
	if (!npmIsInitialized) {
		throw new Error("initialize must be called before using the version manager");
	}

	npm.commands[command](Array.prototype.slice.call(arguments, 2), true, function (error, response) {
		if (error) return callback(error);
		callback(null, response);
	});
}

function npmExecute(params) {
	var cmd = spawn('npm', params.split(' '), {
		stdio: 'inherit'
	});
}

//
// API
//

exports.initialize = initialize;
exports.run = run;
exports.npmExecute = npmExecute;
