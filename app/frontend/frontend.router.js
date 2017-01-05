var express = require('express');
var router = express.Router();

var options = {
	root: __dirname + '/../../public/'
};

router.get('/', function (req, res) {
	res.sendFile('triggers.html', options);
});
module.exports = router;
