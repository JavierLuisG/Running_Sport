var express = require('express');
var router = express.Router();
var userService = require("../services/users");

/** Por cada endpoint se realiza una función que luego será enrutada con router */

/**
 * Controlador para obtener todos los registros
 * 
 * @param {Object} req - el objeto de solicitud de Express
 * @param {Object} res - el objeto de respuesta de Express
 */
var getAllUsersController = function (req, res, next) {
  userService.getAllUsersServices()
    .then((response) => {
      res.json(response);
    }).catch((error) => {
      next(error);
    });
};

/**
 * Controlador para crear un registro
 * 
 * @param {Object} req - el objeto de solicitud de Express.
 * @param {Object} req.body - los datos del usuario a crear, proporcionados en el cuerpo de la solicitud.
 * @param {Object} res - el objeto de respuesta de Express.
 * @param {Function} next - la función middleware de Express para pasar el control al siguiente manejador.
 * @description - si la creación es exitosa, responde con un estado 201 y los datos del nuevo usuario 
 * y si ocurre un error, pasa el error al siguiente middleware.
 */
var createUserController = function (req, res, next) {
  userService.createUserServices(req.body)
    // ToDo: will change when the database is implemented
    .then((response) => {
      res.status(201).send(response);
    }).catch((error) => {
      next(error);
    });
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

/** 
 * Rutas donde se realizará la operación, tener en cuenta:
 * el verbo (get, post, put, delete) 
 * el parametro '/:email...' cuando está especificado
 * */
router.get('/', getAllUsersController);
router.post('/create', createUserController);
router.get('/:email/detail', getUserByEmailController);
router.put('/:email/update', updateUserByEmailController);
router.delete('/:email/delete', deleteUserByEmail);

module.exports = router;
