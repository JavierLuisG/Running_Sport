var express = require('express');
var router = express.Router();
var userService = require("../services/users");
var verifyToken = require("../middlewares/authMiddleware") // importación del verifyToken para agregarlo entre las rutas

/** Por cada endpoint se realiza una función que luego será enrutada con router */

/**
 * Controlador para obtener todos los registros
 * 
 * @param {Object} req - el objeto de solicitud de Express
 * @param {Object} res - el objeto de respuesta de Express
 */
var getAllUsersController = async function (req, res, next) {
  try {
    const response = await userService.getAllUsersServices();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para crear un registro
 * 
 * @param {Object} req - el objeto de solicitud de Express.
 * @param {Object} req.body - los datos del registro a crear, proporcionados en el cuerpo de la solicitud.
 * @param {Object} res - el objeto de respuesta de Express.
 * @description - si la creación es exitosa, responde con un estado 201 y los datos del nuevo registro 
 * y si ocurre un error, el 409 (conflict).
 */
var createUserController = async function (req, res, next) {
  try {
    const response = await userService.createUserServices(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(409).json(error);
  }
};

/**
 * Controlador para obtener un registro según el parametro
 * 
 * @param {Object} req - el objeto de solicitud de Express.
 * @param {Object} req.params.email - el email del registro.
 * @param {Object} res - el objeto de respuesta de Express.
 * @description - si la consulta es exitosa, responde con un estado 200 y los datos del registro
 * y si ocurre un error, el 404 (not found).
 */
var getUserByEmailController = async function (req, res, next) {
  try {
    const response = await userService.getUserByEmailServices(req.params.email);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error);
  }
};

/**
 * Controlador para actualizar un registro según el parametro
 * 
 * @param {Object} req - el objeto de solicitud de Express.
 * @param {Object} req.params.email - el email del registro.
 * @param {Object} req.body - los datos del registro a actualizar, proporcionados en el cuerpo de la solicitud.
 * @param {Object} res - el objeto de respuesta de Express.
 * @method error.code - permite obtener el código de error, con el se puede verificar cual se produjo
 * @description - si la consulta es exitosa, responde con un estado 200 y los datos del registro
 * y si ocurre un error, 404 (not found) o 400 (bad request).
 */
var updateUserByEmailController = async function (req, res, next) {
  try {
    const response = await userService.updateUserByEmailServices(req.params.email, req.body);
    res.status(200).json(response);
  } catch (error) {
    if (error.code === 404) {
      res.status(404).json(error);
    } else if (error.code === 400) {
      res.status(400).json(error);
    }
  }
};

/**
 * Controlador para eliminar el registro actualizando el estado a false
 * 
 * @param {Object} req - el objeto de solicitud de Express.
 * @param {Object} req.params.email - params: busca el parametro que se le indique, en este caso 'email'
 * @param {Object} res - el objeto de respuesta de Express.
 * @method res.sendStatus - Se utiliza porque solamente se va a enviar la petición, 204: no hay contenido dentro del body de ese response.
 * @method error.code - permite obtener el código de error, con el se puede verificar cual se produjo
 * @description - si la consulta es exitosa, responde con un estado 204 sin cuerpo 
 * y si ocurre un error, 404 (not found) o 400 (bad request).
 */
var deleteUserByEmailController = async function (req, res, next) {
  try {
    await userService.deleteUserByEmailServices(req.params.email);
    res.sendStatus(204);
  } catch (error) {
    if (error.code === 404) {
      res.status(404).json(error);
    } else if (error.code === 400) {
      res.status(400).json(error);
    }
  }
};

/**
 * Controlador para autenticar el usuario y generar un token JWT.
 * 
 * @param {Object} req - el objeto de solicitud de Express.
 * @param {Object} req.body - los datos del usuario para autenticar, proporcionados en el cuerpo de la solicitud.
 * @param {Object} res - el objeto de respuesta de Express.
 * @description - si la autenticación es exitosa, responde con un estado 200 devolviendo los datos del usuario y un token JWT en la respuesta 
 * y si hay un error, 400 (bad request).
 */
var userAuthenticateController = async function (req, res, next) {
  try {
    var response = await userService.userAuthenticateServices(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

/** 
 * Rutas donde se realizará la operación, tener en cuenta:
 *  el verbo (get, post, put, delete) 
 *  el parametro '/:email...' cuando está especificado
 * Se agrega verifyToken en donde se quiere que haya verificación del token
 */
router.get('/', verifyToken, getAllUsersController);
router.post('/create', createUserController);
router.get('/:email/detail', verifyToken, getUserByEmailController);
router.put('/:email/update', verifyToken, updateUserByEmailController);
router.delete('/:email/delete', verifyToken, deleteUserByEmailController);
router.post('/authenticate', userAuthenticateController);

module.exports = router;
