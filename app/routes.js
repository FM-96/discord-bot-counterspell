module.exports = function (app) {
	var triggerRouter = require('./trigger/trigger.router.js');
	var frontendRouter = require('./frontend/frontend.router.js');

	app.use('/api/trigger', triggerRouter);
	app.use('/', frontendRouter);
}
