var express = require('express');
var router = express.Router();

var path = require('path');

var options = {
	root: path.join(__dirname, '../../public'),
};

router.get('/', function (req, res) {
	res.sendFile('triggers.html', options);
});

module.exports = router;
