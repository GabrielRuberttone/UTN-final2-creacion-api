//1 llamamos al metodo para verificar los tokens: tokenVerify.Ya no necesito el de firmar.
// const jwt = require("../utils/handleJWT"); //a-podemos hacerlo asi y luego llamar jwt.tokenVerify
const {tokenVerify} = require("../utils/handleJWT");//b-podemos hacerlo tambien asi 




//2 hacemos un middleware booleano que nos indique si esta autorizado. Por se booleano tiene el prefijo `is`  isAuth
const isAuth = async (req, res, next) =>{ //es asincronico y recibe req, res, y next para pasar al controlador en caso de que este autorizado
let error = new Error ("Forbidden acces | Invalid token");

if(!req.headers.authorizations){//vemos si está la cabecera autorization: sino esta no hay un token 
    let error = new Error ("No token provided");
    error.status = 403; //le enviamos el estado de error, es una asignacion directa
    return next(error);//me retorna al manejado de errores.
}
//Si el codigo del if no ocurrio, es que tengo un token, ahora tenemos que ver si es valido
const token = req.headers.authorizations.split(" ").pop();//Extraigo el token. Tengo que partirlo porque viene con la palabre bearer y un espacio adelante

const verifiedToken = await tokenVerify(token); //NO FUNCIONA ESTA PARTE
 if (verifiedToken instanceof Error){ //NO FUNCIONA ESTA PARTE
    error.status = 401; //NO FUNCIONA ESTA PARTE
    error.message = "invalid token ||";//NO FUNCIONA ESTA PARTE
    return next (error);//NO FUNCIONA ESTA PARTE
 }
 next();//NO FUNCIONA ESTA PARTE
};

module.exports = isAuth; //exporto el middleware