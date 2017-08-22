module.exports.addTrigger = addTrigger;
module.exports.deleteTrigger = deleteTrigger;
module.exports.getAllTriggers = getAllTriggers;
module.exports.updateTrigger = updateTrigger;

var Trigger = require('./trigger.model.js');

function addTrigger(req, res) {
	// TODO validation
	var trigger = new Trigger(req.body);
	trigger.save().then(
		function (savedTrigger) {
			res.send(savedTrigger);
		}
	).catch(
		function (err) {
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
			res.sendStatus(500);
		}
	);
}

function updateTrigger(req, res) {
	// TODO validation
	var id = req.body._id;
	var updated = req.body;
	delete updated._id;

	Trigger.findByIdAndUpdate(id, updated).exec().then(
		function (updatedTrigger) {
			res.sendStatus(200);
		}
	).catch(
		function (err) {
			res.sendStatus(500);
		}
	);
}
