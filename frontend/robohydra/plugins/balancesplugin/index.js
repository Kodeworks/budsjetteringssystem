const { june, july } = require('./months');
const { heads: { RoboHydraHead, RoboHydraHeadProxy } } = require('robohydra');

module.exports.getBodyParts = conf => {
	return {
		heads: [
			new RoboHydraHead({
				path: '/month.*',
				handler: function (req, res) {
					res.headers['content-type'] = 'application/json';
					res.statusCode = 200;
					console.log(req.queryParams);
					if (req.queryParams['month'] === '6') {
						res.send(JSON.stringify(june));
					} else if (req.queryParams['month'] === '7') {
						console.log(june);
						res.send(JSON.stringify(july));
					} else {
						res.send(JSON.stringify([]));
					}
				}
			}),
			new RoboHydraHeadProxy({
				mountPath: '/',
				proxyTo: 'http://localhost:8000',
			}),
		]
	};
}
