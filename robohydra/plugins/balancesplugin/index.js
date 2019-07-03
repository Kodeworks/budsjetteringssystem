const RoboHydraHeadStatic = require("robohydra").heads.RoboHydraHeadStatic;
const RoboHydraHead = require("robohydra").heads.RoboHydraHead;
const june = require("./months").june;
const july = require("./months").july;

exports.getBodyParts = function(conf) {
	return {
		heads: [
			new RoboHydraHead({
				path: '/month.*',
				handler: function(req, res, next) {
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
		]
	};
};
