//SOLO HACEMOS EL ENRUTAMIENTO
//requerimos express: Como utiliza el router nativo de express lo vamos a traer
const router = require("express").Router();
const uploadPic = require("../utils/handleStorage") //traemos el midleware de multer para cargar la imagen

//traemos las funciones de userCt.js
const {getAllUsers,  deleteUserById, createUser, updateUser, loginUser} = require("./userCt")//puedo hacerlo de esta forma, o como la linea que sigue
// const userCt = require("./userCt") //otra forma de traer metodos de usertCt

//ahora manejo los distintos metodos y verbos del http: get, post, delete, etc..
router.get("/", getAllUsers );//escribir "/" es igual a escribir "api/users", pero si escribo esto segundo se estaria duplicando la ruta. 

//creo el usuario
router.post("/", uploadPic.single("profilePic"), createUser)  //uso el metodo post e indico cual es la ruta.
// router.post("/", userCt.createUser) //si uso la segunda forma para traer las funciones de userCt, tengo que usar esto. 

//hacemos la ruta del login
router.post("/login", loginUser)

//update user
router.put("/:id", updateUser)

//creo un delete, para ello necesito indicar el recurso exacto por medio de un id. Cuando indicamos un segmento dinamico escribimos :
router.delete("/:id", deleteUserById );

//exportamos el modulo
module.exports = router;