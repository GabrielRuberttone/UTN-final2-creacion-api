//SOLO HACEMOS EL ENRUTAMIENTO
//requerimos express: Como utiliza el router nativo de express lo vamos a traer
const router = require("express").Router();

//traemos las funciones de userCt.js
const {getAllUsers,  deleteUserById} = require("./userCt")

//ahora manejo los distintos metodos y verbos del http: get, post, delete, etc..
router.get("/", getAllUsers );

//creo un delete, para ello necesito indicar el recurso exacto por medio de un id. Cuando indicamos un segmento dinamico escribimos :
router.delete("/:id", deleteUserById );


//exportamos el modulo
module.exports = router;