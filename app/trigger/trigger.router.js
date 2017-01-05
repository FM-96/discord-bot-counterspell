var express = require('express');
var router = express.Router();

var triggerController = require('./trigger.controller.js');

router.post('/add', triggerController.addTrigger);
router.post('/delete', triggerController.deleteTrigger);
router.get('/all', triggerController.getAllTriggers);
router.post('/update', triggerController.updateTrigger);

module.exports = router;
