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
 * @method resolve - se ejecuta cuando la operación es exitosa
 * @method reject - se ejecuta cuando la operación falló
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
 * obtiene un registro por medio del resolve 
 * 
 * @returns - promesa según lo que se ejecute en el try-catch
 * @param emailParam - contiene el email ingresado por el usuario 
 * @method resolve - se ejecuta cuando la operación es exitosa
 * @method reject - se ejecuta cuando la operación falló
 * @description - try-catch para manejar correctamente los casos de éxito y de error,
 * asegura que cualquier error será capturado y pasado al reject.
 */
var getUserByEmailServices = async function (emailParam) {
    // ToDo: remove when the database implement
    return new Promise((resolve, reject) => {
        try {
            resolve(users[1]);
        } catch (error) {
            reject(error);
        }
    })
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
            userUpdate.birthday = users[0].birthDate
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

// como este script no es visible, para exportar un módulo dentro de JS se usa el patrón factory
module.exports = {
    getAllUsersServices,
    createUserServices,
    getUserByEmailServices,
    updateUserByEmailServices,
    deleteUserByEmailServices
};