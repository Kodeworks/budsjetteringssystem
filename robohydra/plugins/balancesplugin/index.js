const RoboHydraHeadStatic = require("robohydra").heads.RoboHydraHeadStatic;

exports.getBodyParts = function(conf) {
	return {
		heads: [
			new RoboHydraHeadStatic({
				path: '/month/?month=6&year=2019&company_id=1*',
				content: [
						{ 
							"year": 2019,
							"month": 6,
							"transactions": [
								{
									"id": 1,
									"company_id": 1,
									"recurring_id": 0,
									"date": "2019-06-28",
									"money": 1000000,
									"type": "income",
									"description": "Rent for storage",
									"notes": "Example notes"
								}, 
								{
									"id": 2,
									"company_id": 1,
									"recurring_id": 0,
									"date": "2019-06-03",
									"money": 1200000,
									"type": "income",
									"description": "Rent for storage",
									"notes": "Example notes"
								},
								{
									"id": 3,
									"company_id": 1,
									"recurring_id": 0,
									"date": "2019-06-03",
									"money": 2000000,
									"type": "income",
									"description": "Payment for consultation",
									"notes": "Example notes"
								},
								{
									"id": 4,
									"company_id": 1,
									"recurring_id": 0,
									"date": "2019-06-22",
									"money": 5000000,
									"type": "expense",
									"description": "Salary",
									"notes": "Example notes"
								}
							],
							"balance": [
								{
									"company_id": 1,
									"date": "2019-06-03",
									"money": 13200000
								},
								{
									"company_id": 1,
									"date": "2019-06-22",
									"money": 8200000
								},
								{
									"company_id": 1,
									"date": "2019-06-28",
									"money": 9200000
								},
							],
							"start_balance": 10000000,
							"lowest_balance": 10000000,
							"next": "string",
							"previous": "string"
						}, 
					]
			})
		]
	};
};
