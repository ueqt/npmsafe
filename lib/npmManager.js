var spawn = require('win-spawn');

function npmExecute(params) {
	var cmd = spawn('npm', params.split(' '), {
		stdio: 'inherit'
	});
}

//
// API
//

exports.npmExecute = npmExecute;
