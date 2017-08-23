module.exports.addTrigger = addTrigger;
module.exports.deleteTrigger = deleteTrigger;
module.exports.getAllTriggers = getAllTriggers;
module.exports.updateTrigger = updateTrigger;

var Trigger = require('./trigger.model.js');

function addTrigger(req, res) {
	var validationResult = validateRequest(req);
	if (validationResult.isValid === false) {
		res.status(400).send(validationResult.errors.join(', '));
		return;
	}

	var trigger = new Trigger(req.body);
	trigger.save().then(
		function (savedTrigger) {
			res.send(savedTrigger);
		}
	).catch(
		function (err) {
			console.error(err);
			res.sendStatus(500);
		}
	);
}

function deleteTrigger(req, res) {
	Trigger.findByIdAndRemove(req.body._id).exec().then(
		function (deletedTrigger) {
			res.sendStatus(200);
		}
	).catch(
		function (err) {
			console.error(err);
			res.sendStatus(500);
		}
	);
}

function getAllTriggers(req, res) {
	Trigger.find({}).exec().then(
		function (docs) {
			res.send(docs);
		}
	).catch(
		function (err) {
			console.error(err);
			res.sendStatus(500);
		}
	);
}

function updateTrigger(req, res) {
	var validationResult = validateRequest(req);
	if (validationResult.isValid === false) {
		res.status(400).send(validationResult.errors.join(', '));
		return;
	}

	var id = req.body._id;
	var updated = req.body;
	delete updated._id;

	Trigger.findByIdAndUpdate(id, updated).exec().then(
		function (updatedTrigger) {
			res.sendStatus(200);
		}
	).catch(
		function (err) {
			console.error(err);
			res.sendStatus(500);
		}
	);
}

function isValidId(id) {
	return id === '*' || /^[0-9]+$/.test(id);
}

function validateRequest(req) {
	var result = {
		isValid: true,
		errors: [],
	};

	if (!isValidId(req.body.guildId)) {
		result.isValid = false;
		result.errors.push('guild ID not valid');
	}
	if (!isValidId(req.body.channelId)) {
		result.isValid = false;
		result.errors.push('channel ID not valid');
	}
	if (!isValidId(req.body.userId)) {
		result.isValid = false;
		result.errors.push('user ID not valid');
	}
	if (!['contains', 'exactly', 'regex'].includes(req.body.method)) {
		result.isValid = false;
		result.errors.push('method not valid');
	}
	if (req.body.text === '') {
		result.isValid = false;
		result.errors.push('text not valid');
	}

	return result;
}
