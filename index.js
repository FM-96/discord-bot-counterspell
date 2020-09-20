var bodyParser = require('body-parser');
var Discord = require('discord.js');
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var fs = require('fs');
var http = require('http');
var path = require('path');

var botToken = null;
var bot = new Discord.Client({
	ws: {
		intents: Discord.Intents.NON_PRIVILEGED,
	},
});

var config = require('./config.json');
var counterspells = require('./counterspells.js');
var Trigger = require('./app/trigger/trigger.model.js');

// use native promises for mongoose
mongoose.Promise = Promise;

// get discord bot token
if (!fileExists(path.join(__dirname, 'discord_bot_token.txt'))) {
	// create file
	fs.closeSync(fs.openSync(path.join(__dirname, 'discord_bot_token.txt'), 'w'));
}
// read token from file
botToken = fs.readFileSync(path.join(__dirname, 'discord_bot_token.txt'), 'utf8');
if (!botToken) {
	console.log('No bot token found.');
	console.log('Save the token in discord_bot_token.txt and restart the application.');
	process.exit(0);
} else {
	console.log('Bot token loaded.');
}

// set up webserver
app.use(bodyParser.json());
require('./app/routes.js')(app);
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use(function (req, res) {
	res.sendStatus(404);
});
var httpServer = http.createServer(app);

bot.on('message', function (message) {
	if (message.author.id === bot.user.id) {
		return;
	}

	toDelete(message).then(
		function (result) {
			if (result) {
				return message.channel.send('__**' + counterspells[Math.floor(Math.random() * counterspells.length)] + '**__');
			}
		}
	).then(
		function (sentMessage) {
			if (sentMessage) {
				return Promise.all([
					message.delete({timeout: 600}),
					sentMessage.delete({timeout: 1400}),
				]);
			}
		}
	).catch(
		function (err) {
			console.log('Error countering message: ' + err);
		}
	);
});

bot.on('ready', function () {
	console.log('Bot is ready.');
});

bot.on('error', function (error) {
	console.log('Discord Error: ' + error);
});

bot.on('warn', function (warning) {
	console.log('Discord Warning: ' + warning);
});

// connect to database
mongoose.connect(config.db, {useMongoClient: true}).then(
	function (result) {
		// start bot
		return bot.login(botToken);
	}
).then(
	function (result) {
		// start webserver
		httpServer.listen(config.port, function () {
			console.log('Server started.');
		});
	}
).catch(
	function (error) {
		if (error) {
			console.error('Error while logging in: ' + error);
			process.exit(1);
		}
	}
);

function toDelete(message) {
	return Trigger.find({
		$and: [
			{
				$or: [
					{guildId: '*'},
					{guildId: message.guild.id},
				],
			},
			{
				$or: [
					{channelId: '*'},
					{channelId: message.channel.id},
				],
			},
			{
				$or: [
					{userId: '*'},
					{userId: message.author.id},
				],
			},
		],
	}).exec().then(
		function (docs) {
			for (let trigger of docs) {
				if (trigger.method === 'exactly' && message.content === trigger.text) {
					return true;
				}
				if (trigger.method === 'contains' && message.content.includes(trigger.text)) {
					return true;
				}
				if (trigger.method === 'regex' && new RegExp(trigger.text).test(message.content)) {
					return true;
				}
			}
			return false;
		}
	);
}

// utility functions
function fileExists(filePath) {
	try {
		fs.statSync(filePath);
		return true;
	} catch (e) {
		return false;
	}
}
