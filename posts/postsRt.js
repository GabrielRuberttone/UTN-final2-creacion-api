
//4 importamos el archivo del controlador. Lo puedo hacer de 2 formas, en userRt lo hice de otra.
const postCt = require("./postsCt");
const isAuth = require("../middlewares/sesion")//traemos el middleware
//1 requerimos express: Como utiliza el router nativo de express lo vamos a traer
const router = require("express").Router();

//HACEMOS NUESTRAS RUTAS
//2 llamamos a todos los posteos: 
router.get("/", postCt.listAllPosts); 
//3 hacemos la funcion en el postsCt.js para que no tire error

//buscamos un posteo con una query. En este caso un title.
router.get("/find/:query", postCt.finByTitle );

//create new post
// router.post("/", isAuth, postCt.createNewPost); 
router.post("/", postCt.createNewPost);//sacamos el middleware de authorizacion


module.exports = router; //5 exporto para poder llamarlo desde el index.js.