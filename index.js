var Discord = require('discord.js');
var fs = require('fs');

var botToken = null;
var bot = new Discord.Client();
var counterspells = require('./counterspells.js');

//get discord bot token
if (!fileExists(__dirname + '/discord_bot_token.txt')) {
	//create file
	fs.closeSync(fs.openSync(__dirname + '/discord_bot_token.txt', 'w'));
}
//read token from file
botToken = fs.readFileSync(__dirname + '/discord_bot_token.txt', 'utf8');
if (!botToken) {
	console.log('No bot token found.');
	console.log('Save the token in discord_bot_token.txt and restart the application.');
	process.exit(0);
} else {
	console.log('Bot token loaded.');
}

bot.on('message', function (message) {
	if (message.author.id === bot.user.id) {
		return;
	}
	if (toDelete(message)) {
		message.channel.sendMessage('__**' + counterspells[Math.floor(Math.random() * counterspells.length)] + '**__').then(function (sentMessage) {
			return Promise.all([
				message.delete(600),
				sentMessage.delete(1400)
			]);
		}).catch(function (err) {
			console.log('Error countering message: ' + error);
		});
	}
});

bot.on('ready', function () {
	console.log('Successfully logged into Discord.');
	console.log('Bot is ready.');
});

bot.on('error', function (error) {
	console.log('Discord Error: ' + error);
});

bot.on('warn', function (warning) {
	console.log('Discord Warning: ' + warning);
});

//start bot
bot.login(botToken);

function toDelete(message) {
	if (message.author.id === '219501150058184704') { //SandboxBot
		if (message.content === 'sockpuppet? Oh, sockpuppet is dumb and ugly') {
			return true;
		}
	}

	if (message.author.id === '216179498683596802') { //PatricksBot
		if (message.content.includes(', lol, who the fuck do you think you are? This incident has been logged and reported.')) {
			return true;
		}
	}

	if (message.author.id === '196059744991969280') { //FM-96's Test Bot (Nora)
		if (message.content === 'Hey, that\'s code! I\'m made of that!') {
			return true;
		}
		if (message.content === 'Yes! Let the airhorning commence!') {
			return true;
		}
	}

	return false;
}

//utility functions
function fileExists(path) {
	try {
		fs.statSync(path);
		return true;
	} catch (e) {
		return false;
	}
}
