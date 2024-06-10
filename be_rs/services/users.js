var Promise = require("bluebird"); // importar bluebird para usar las funcionalidades de promesas
var users = require("../mocks/users.json"); // importar el archivo con JSON de users para realizar pruebas

/** 
 * por cada función en router, se realizará una función asíncrona que devuelve una promesa 
 * según la interaccion con los datos 
 */

/**
 * obtiene todos los registros por medio del resolve
 * 
 * @returns - promesa según lo que se ejecute en el try-catch
 * @param - no necesita parámetros 
 * @method resolve - se ejecuta cuando la operacion es exitosa
 * @method reject - se ejecuta cuando la operacion falló
 * @description - try-catch para manejar correctamente los casos de éxito y de error,
 * asegura que cualquier error será capturado y pasado al reject.
 */
var getAllUsersServices = async function () {
    // ToDo: remove when the database implement
    return new Promise((resolve, reject) => {
        try {
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
};

/**
 * crea un registro por medio del resolve 
 * (todo: no se creará en puebas, se traerá un registro. Solo se estructura la función)
 * 
 * @returns - promesa según lo que se ejecute en el try-catch
 * @param userParam - contiene los datos ingresados por el usuario 
 * @method resolve - se ejecuta cuando la operacion es exitosa
 * @method reject - se ejecuta cuando la operacion falló
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

// como este script no es visible, para exportar un módulo dentro de JS se usa el patrón factory
module.exports = {
    getAllUsersServices,
    createUserServices
};