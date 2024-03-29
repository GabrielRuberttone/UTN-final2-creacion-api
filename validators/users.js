const { check, validationResult} = require("express-validator");

//creamos un validador para crear usuario y otro para modificarlo
const CreateUser = [ //lo que utiliza express validator es un array: primero tiene un objeto con todas las validaciones y luego un callback
check("fullName")
 .trim()//sanitizante: corta los espacios antes y despues
 .notEmpty()//que no este vacio, es un campo requerido en la BD.
 .withMessage("El campo no puede estar vacio")
 .isAlpha("es-ES", {ignore: " "}) //solo puede haber letras y no puede haber espacios en blanco
 .withMessage("Only letters")
 .isLength({min: 5, max:90})
 .withMessage("Character count: min 5, max 09"),
check("userName")
 .trim()
 .notEmpty()
 .withMessage("El campo no puede estar vacio"),
check("email")
 .trim()
 .notEmpty()
 .withMessage("Filed cannot be empty - El campo no puede estar vacio")
 .isEmail()
 .withMessage("Must be a valid emai address")
 .normalizeEmail(),
check("password")
 .trim()
.notEmpty()
 .withMessage("Filed cannot be empty - El campo no puede estar vacio")
 .isLength({min: 8, max:16})
 .withMessage("Character count: min 6, max 16"),
(req, res, next) => { //lleva next porque es un middleware, y si pasa, tiene que continuar hacia adelante
    const errors = validationResult(req);  //construimos nuestro arreglo de errores en caso que existan y validamos todo lo que venga en la request
    if(!errors.isEmpty() ){ //si errores no esta vacio retornamos nuestro codigo de error.
    return res.status(400).json(errors);
    } else {
      return next(); //si no tiene errores continua hacia adelante 
    }
},
];

//hacemos el validator reset password
const resetPassword = [
    check("password_1")
     .exists()
     .isLength({min:8, max:16})
     .withMessage("Between 8 and 16 characters")
     .trim(),
    check("password_2").custom(async (password_2, {req})=> {//tengo que pasarle la password_1 para poder comparar.
        if(req.body.password_1 !== password_2){
            throw new Error("Passwords must be identical") 
        }
    }),
    (req, res, next) =>{//para correr las validaciones tenemos q pasar un callback
    const token = req.params.token;//si hay errores quiero mostrar otra vez el formulario, pero sin perder el token
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const arrWarnings = errors.array() //lo duplico
        res.render("reset", {arrWarnings, token})
    } else{
        return next();
    }
},
];

module.exports = {CreateUser, resetPassword }; //exportamos el middleware   
