var triggerRouter = require('./trigger/trigger.router.js');
var frontendRouter = require('./frontend/frontend.router.js');

module.exports = function (app) {
	app.use('/api/trigger', triggerRouter);
	app.use('/', frontendRouter);
};
