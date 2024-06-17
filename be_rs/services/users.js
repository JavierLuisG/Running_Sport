var Promise = require("bluebird"); // importar bluebird para usar las funcionalidades de promesas
var users = require("../mocks/users.json"); // importar el archivo con JSON de users para realizar pruebas
var jwt = require("jsonwebtoken"); // libreria para poder hacer la firma
var config = require("../middlewares/config.json"); // traer el secret para hacer la firma del código
var db = require("../config/db_mongo"); // importando la configuración de la base de datos y los modelos definidos
var User = db.User; // acceder al modelo users desde la instancia de la base de datos

/* ====================================================================================== */

/** 
 * por cada función en router, se realizará una función asíncrona que devuelve una promesa 
 * según la interacción con los datos 
 */

/**
 * obtiene todos los registros que se encuentren activos (status: true)
 * 
 * @returns {Promise<Array>} - promesa que se resuelve con una lista de usuarios activos.
 * @param - no necesita parámetros
 * @method await - se utiliza para esperar a que una promesa se resuelva o se rechace.
 * @method select - indicar cuales campos pueden aparecer
 * @method exec - ejecutar la consulta y obtener los resultados 
 */
var getAllUsersServices = async function () {
    try {
        return await User.find({ status: true }).select("id email firstname lastname birthdate phone status role").exec();
    } catch (error) {
        throw new Error("Error al obtener usuarios activos ", error.message);
    }
};

/**
 * crea un registro si el email no se encuentra activo 
 * 
 * @returns - promesa que se resuelve con los datos de un registro recién creado 
 * @param userParam - contiene los datos ingresados por el usuario 
 * @throws {Object} - un objeto de error con el código 409 si el email existe.
 * @method save - permite guardar en la base de datos 
 * @description - paso a paso: 
 * 1. Obtener el registro por medio del email y status como parametros
 * 2. Si el registro existe, lanzar un error 409 (conflict)
 * 3. Crear una instancia del esquema que se define en 'model/users.js'
 * 4. Configurar por default que tenga un 'status: true' y un 'role: client'
 * 5. ODM, guardar la instancia en la base de datos
 * 6. Devolver la información del registro creado por medio del método 'getUserByEmailServices()'
 */
var createUserServices = async function (userParam) {
    // 1.
    var findUser = await User.findOne({ email: userParam.email, status: true });
    // 2.
    if (findUser) {
        throw { code: 409, message: "Conflicto, usuario " + userParam.email + " ya existente" };
    }
    // 3.
    var userInstance = new User(userParam);
    // 4.
    userInstance.status = true;
    userInstance.role = 'client';
    // 5.
    await userInstance.save();
    // 6.
    return getUserByEmailServices(userParam.email);
};

/**
 * obtiene un registro que se encuentre activo por medio del email
 * 
 * @returns {Promise<Object>} - promesa que se resuelve con el objeto que representa el registro encontrado,
 * si no se encuentra ningún registro con el email especificado, la promesa se rechaza con un error 404.
 * @param emailParam - contiene el email ingresado por el usuario
 * @method await - se utiliza para esperar a que una promesa se resuelva o se rechace.
 * @method select - indicar cuales campos pueden aparecer
 * @method exec - ejecutar la consulta y obtener los resultados 
 */
var getUserByEmailServices = async function (emailParam) {
    var userByEmail = await User.findOne({ email: emailParam, status: true })
        .select("id email firstname lastname birthdate phone status role").exec();
    if (!userByEmail) {
        throw { code: 404, message: "Usuario " + emailParam + " no encontrado" };
    }
    return userByEmail;
};

/**
 * actualiza el registro si el email está activo
 * 
 * @returns {Promise<Object>} - promesa que se resuelve con el objeto que representa el registro actualizado.
 * Si no se encuentra ningún registro con el email especificado, la promesa se rechaza con un error 404.
 * Si ocurre un error al actualizar el registro, la promesa se rechaza con un error 400.
 * @param emailParam - contiene el email ingresado por el usuario 
 * @param userParam - contiene los datos a actualizar
 * @method findByIdAndUpdate - dos parametros: (el primero '.id', el segundo 'el objeto con la información a actualizar)
 * @description - paso a paso: 
 * 1. Obtener el registro por medio del email y status como parametros
 * 2. Si el registro no existe, lanzar un error 404 (not found)
 * 3. Actualizar los datos del registro
 * 4. Verificar si el registro actualizado contiene un error, lanzar un error 400 (bad request)
 * 5. Devolver la información del registro actualizado por medio del método 'getUserByEmailServices()'
 */
var updateUserByEmailServices = async function (emailParam, userParam) {
    // 1.
    var findUser = await User.findOne({ email: emailParam, status: true });
    // 2.
    if (!findUser) {
        throw { code: 404, message: "Usuario " + emailParam + " no encontrado" };
    }
    // 3.
    var userUpdate = await User.findByIdAndUpdate(findUser.id,
        { firstname: userParam.firstname, lastname: userParam.lastname, phone: userParam.phone });
    // 4.
    if (!userUpdate) {
        throw { code: 400, message: "Error en la actualización del usuario " + findUser.email };
    }
    // 5.
    return getUserByEmailServices(findUser.email);
};

/**
 * elimina un registro por medio del cambio de estado, de true a false 
 *  
 * @returns {Promise<Object>} - Una promesa que se resuelve con el registro eliminado.
 * @param emailParam - contiene el email ingresado por el usuario 
 * @method findByIdAndUpdate - dos parametros: (el primero '.id', el segundo 'el objeto con la información a actualizar)
 * @description - paso a paso:
 * 1. Obtener el registro por medio del email y status como parametro
 * 2. Si el registro no existe, lanzar un error 404 (not found)
 * 3. Cambiar el status a false de la base de datos
 * 4. Verificar si el registro actualizado no se llevó a cabo, lanzar un error 400 (bad request)
 */
var deleteUserByEmailServices = async function (emailParam) {
    var findUser = await User.findOne({ email: emailParam, status: true });
    if (!findUser) {
        throw { code: 404, message: "Usuario " + emailParam + " no encontrado" };
    }
    var userUpdate = await User.findByIdAndUpdate(findUser.id, { status: false });
    if (!userUpdate) {
        throw { code: 400, message: "Error en la eliminación del usuario " + findUser.email };
    }
};

/**
 * Servicio para autenticar a un usuario verificando credenciales de email y password.
 *
 * @param {Object} userParam - El objeto que contiene las credenciales del usuario.
 * @param {string} userParam.email - El correo electrónico del usuario que se está autenticando.
 * @param {string} userParam.password - La contraseña del usuario que se está autenticando.
 * @returns {Promise<Object>} - Una promesa que se resuelve con los datos del usuario autenticado, incluido un token JWT.
 * @throws {Error} - Lanza un error si la autenticación falla.
 */
var userAuthenticateServices = async function (userParam) {
    return new Promise((resolve, reject) => {
        //ToDo: remove when the DB implemented
        var userAuth = users[0]; // Simula la autenticación usando un usuario ficticio del arreglo `users`
        // Si el usuario no se encuentra o la contraseña con el email es incorrecta, rechaza la promesa
        if (!userAuth || userAuth.email !== userParam.email || userAuth.password !== userParam.password) {
            return reject(new Error("Error en la autenticación, pilas ahí"));
        }
        // El payload del token contiene los datos del usuario
        const payload = {
            sub: userAuth.id,
            firstname: userAuth.firstname,
            lastname: userAuth.lastname,
            birthdate: userAuth.birthdate,
            email: userAuth.email,
            phone: userAuth.phone,
            locale: 'CO',
            roles: userAuth.role
        };
        // Genera un token JWT para el usuario autenticado
        userAuth.token = jwt.sign(payload, config.secret, { expiresIn: '60m' });
        // resuelve la promesa con el usuario registrado
        resolve(userAuth);
    });
};

// como este script no es visible, para exportar un módulo dentro de JS se usa el patrón factory
module.exports = {
    getAllUsersServices,
    createUserServices,
    getUserByEmailServices,
    updateUserByEmailServices,
    deleteUserByEmailServices,
    userAuthenticateServices
};