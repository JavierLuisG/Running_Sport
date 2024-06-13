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
 * crea un registro por medio del resolve 
 * (todo: no se creará en puebas, se traerá un registro. Solo se estructura la función)
 * 
 * @returns - promesa según lo que se ejecute en el try-catch
 * @param userParam - contiene los datos ingresados por el usuario 
 * @method resolve - se ejecuta cuando la operación es exitosa
 * @method reject - se ejecuta cuando la operación falló
 * @description - try-catch para manejar correctamente los casos de éxito y de error,
 * asegura que cualquier error será capturado y pasado al reject.
 */
var createUserServices = async function (userParam) {
    // ToDo: remove when the database implement
    return new Promise((resolve, reject) => {
        try {
            resolve(users[0]);
        } catch (error) {
            reject(error);
        }
    })
};

/**
 * obtiene un registro que se encuentre activo por medio del email
 * 
 * @returns - promesa que se resuelve con el usuario activo que posea el email
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
 * actualiza un registro por medio del resolve 
 * 
 * @returns - promesa según lo que se ejecute en el try-catch
 * @param emailParam - contiene el email ingresado por el usuario 
 * @param userParam - contiene los datos a actualizar
 * @method resolve - se ejecuta cuando la operación es exitosa
 * @method reject - se ejecuta cuando la operación falló
 * @description - try-catch para manejar correctamente los casos de éxito y de error,
 * asegura que cualquier error será capturado y pasado al reject.
 */
var updateUserByEmailServices = async function (emailParam, userParam) {
    // ToDo: remove when the database implement
    return new Promise((resolve, reject) => {
        try {
            var userUpdate = {}; // crear un objeto
            // valores a actualizar
            userUpdate.id = users[0].id;
            userUpdate.firstname = userParam.firstname;
            userUpdate.lastname = userParam.lastname;
            userUpdate.birthdate = users[0].birthdate
            userUpdate.email = users[0].email;
            userUpdate.phone = userParam.phone;
            userUpdate.status = users[0].status;
            userUpdate.role = users[0].role;
            resolve(userUpdate); // devuelve el objeto creado 
        } catch (error) {
            reject(error);
        }
    })
};

/**
 * elimina un registro por medio del resolve 
 * 
 * @returns - promesa según lo que se ejecute en el try-catch
 * @param emailParam - contiene el email ingresado por el usuario 
 * @method resolve - se ejecuta cuando la operación es exitosa, no hay contenido dentro del body de ese response
 * @method reject - se ejecuta cuando la operación falló
 * @description - try-catch para manejar correctamente los casos de éxito y de error,
 * asegura que cualquier error será capturado y pasado al reject.
 */
var deleteUserByEmailServices = async function (emailParam) {
    // ToDo: remove when the database implement
    return new Promise((resolve, reject) => {
        try {
            resolve();
        } catch (error) {
            reject(error);
        }
    })
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