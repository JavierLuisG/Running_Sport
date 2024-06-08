var express = require('express');
var router = express.Router();

/* GET users listing. */

var getAllUsersController = function (req, res, next) {
  res.send('respond with a resource');
};

var createUserController = function (req, res, next) {
  res.send('respond with a resource');
};

var getUserByEmailController = function (req, res, next) {
  res.send('respond with a resource');
};

var updateUserByEmailController = function (req, res, next) {
  res.send('respond with a resource');
};

var deleteUserByEmail = function (req, res, next) {
  res.send('respond with a resource');
};

router.get('/', getAllUsersController);
router.post('/create', createUserController);
router.get('/:email/detail', getUserByEmailController);
router.put('/:email/update', updateUserByEmailController);
router.delete('/:email/delete', deleteUserByEmail);

module.exports = router;
