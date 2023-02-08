var express = require('express');
var router = express.Router();
const controller = require('../controllers/appointments.controller');

/* GET users listing. */
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.post('/', controller.create);
router.patch('/:id', controller.updateOne);
router.delete('/:id', controller.deleteOne);
router.get('/:id/participants', controller.findParticipants);
router.post('/:id/participants', controller.addParticipant);
router.delete('/:id/participants/:participantId', controller.removeParticipant);
module.exports = router;
