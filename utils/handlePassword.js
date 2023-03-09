const bcrypt = require("bcrypt");
//tiene 2 metodos, el hash (genera una contrasena encriptada) y el compare(toma la contrasena del usuario y la compara con la encriptada en la BD)

//elegimos el satRounds el que normalmente ponemos en 10
const saltRounds = 10;

//1-hacemos una funcion hash para encriptar. Se recomienda usar async()
const hashPassword = async (password) => {//la funcion recibe de parametro la password
return await bcrypt.hash( password, saltRounds) //retorna un bcrypt hash, que toma el password y el saltRounds
};

//2- hacemos una funcion para comparar
const checkPassword = async(password, hashedPassword)=> {//la funcion recibe de parametro la contrasena, y la contrasena guardada en la BD.
    return await bcrypt.compare (password, hashedPassword) //retorna la comparacion entre la  contrasena, y la contrasena guardada en la BD
};

//exporto el modulo
module.exports ={hashPassword,checkPassword }