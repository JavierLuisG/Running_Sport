// 1. Conectarse con el driver de la base de datos (conecta la capa de servicio con la capa de mongoose)
var mongoose = require('mongoose');

mongoose.set('strictQuery', false);

var main = async function() {
    /* Se especifica el la url con el nombre de la base de datos (runningsport) */
    await mongoose.connect('mongodb://localhost:27017/runningsport', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

main().then((connect) => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(err);
});

module.exports = {
    User: require('../model/users'),
};