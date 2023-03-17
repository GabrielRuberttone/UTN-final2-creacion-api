//MIDLLEWARE PARA EL MANEJO DE JSONWEBTOKEN
const jwt = require("jsonwebtoken"); //importamos jwt
const jwt_secret = process.env.jwt_secret;//traemos la clave secreta

//Crea el Token. Es una funcion que recibe un parametro el objeto usuario (payload con user data de la BD)
const tokenSign = async (user, time ) => {//es asincronico porque va a demorar. Se puede recibir un segundo parametro "time" que nos puede servir para colocar un tiempo de expiracion distinto. 
const sign = jwt.sign(user, jwt_secret, {expiresIn: time})//jwt.sign firma el token, recibe como primer parametro el user (payload), la clave secreta, y el tiempo de expiracion.
return sign; //retorna la firma del token
}


//verifica que el token haya sido firmado por el backend. El metodo recibe el token de sesion, y la clave secreta.
const tokenVerify = async (tokenJWT) =>{ //funcion asincronica que recibe el token de sesion
try {//hacemos un try-catch por si falla algo.
    return jwt.verify(tokenJWT,jwt_secret); //jwt.verify el metodo sirve para hacer la validacion del token, el primer parametro es el token que viene en la request, y segundo la clave secreta. 
} catch (error) { //si hay un error ingresa aca y retorna el error. En handler de errores se va a encargar de el.
    return error;
}
};

module.exports = {tokenSign, tokenVerify} //exporto el modulo con los 2 metodos que creamos. 