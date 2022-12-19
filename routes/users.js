var express = require('express');
var router = express.Router();
const usersController = require('../controllers/users.controller');

/* GET users listing. */
router.get('/', usersController.list);

module.exports = router;
