var mongoose = require('mongoose');

var schema = mongoose.Schema({
	guildId: String,
	channelId: String,
	userId: String,
	method: String,
	text: String
});

module.exports = mongoose.model('Trigger', schema, 'triggers');
