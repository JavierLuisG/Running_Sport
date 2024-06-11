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
 * @param {Object} req.body - los datos del registro a crear, proporcionados en el cuerpo de la solicitud.
 * @param {Object} res - el objeto de respuesta de Express.
 * @param {Function} next - la función middleware de Express para pasar el control al siguiente manejador.
 * @description - si la creación es exitosa, responde con un estado 201 y los datos del nuevo registro 
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

/**
 * Controlador para obtener un registro según el parametro
 * 
 * @param {Object} req - el objeto de solicitud de Express.
 * @param {Object} req.params.email - el email del registro.
 * @param {Object} res - el objeto de respuesta de Express.
 * @param {Function} next - la función middleware de Express para pasar el control al siguiente manejador.
 * @description - si la consulta es exitosa, responde con un estado 200 y los datos del registro
 * y si ocurre un error, pasa el error al siguiente middleware.
 */
var getUserByEmailController = function (req, res, next) {
  userService.getUserByEmailServices(req.params.email)
    // ToDo: will change when the database is implemented
    .then((response) => {
      res.status(200).send(response);
    }).catch((error) => {
      next(error);
    });
};

/**
 * Controlador para actualizar un registro según el parametro
 * 
 * @param {Object} req - el objeto de solicitud de Express.
 * @param {Object} req.params.email - el email del registro.
 * @param {Object} req.body - los datos del registro a actualizar, proporcionados en el cuerpo de la solicitud.
 * @param {Object} res - el objeto de respuesta de Express.
 * @param {Function} next - la función middleware de Express para pasar el control al siguiente manejador.
 * @description - si la consulta es exitosa, responde con un estado 200 y los datos del registro
 * y si ocurre un error, pasa el error al siguiente middleware.
 */
var updateUserByEmailController = function (req, res, next) {
  userService.updateUserByEmailServices(req.params.email, req.body)
    // ToDo: will change when the database is implemented
    .then((response) => {
      res.status(200).send(response);
    }).catch((error) => {
      next(error);
    });
};

/**
 * Controlador para actualizar el estado a false del registro 
 * 
 * @param {Object} req - el objeto de solicitud de Express.
 * @param {Object} req.params.email - params: busca el parametro que se le indique, en este caso 'email'
 * @param {Object} res - el objeto de respuesta de Express.
 * @method res.sendStatus - Se utiliza porque solamente se va a enviar la petición, 204: no hay contenido dentro del body de ese response.
 * @param {Function} next - la función middleware de Express para pasar el control al siguiente manejador.
 * @description - si la consulta es exitosa, responde con un estado 204 y si ocurre un error, pasa el error al siguiente middleware.
 */
var deleteUserByEmailController = function (req, res, next) {
  userService.deleteUserByEmailServices(req.params.email)
    .then(() => {
      res.sendStatus(204);
    }).catch((error) => {
      next(error);
    });
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
router.delete('/:email/delete', deleteUserByEmailController);

module.exports = router;
