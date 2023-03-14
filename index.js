// require("dotenv").config() //importamos dotenv para que lo pueda leer el proyecto 

const express = require ("express") //requerimos express. En la const express ponemos todo lo de 'express'
require("./config/db.js") //requerimos el archivo de configuracion de la Base de datos
const cors = require("cors");
const PORT = process.env.PORT || 3030; 
const server = express(); //creamos nuestro servidor. En server estan todos los archivos de express. si escribo server. me aparecen todos los metodos que tiene express Ej: server._router   server.addListener  server.get

//expres core middleware
server.use(express.static('public'));
server.use(express.json())
server.use(express.urlencoded({extended: true })) 

//external middlewares
server.use(cors());//esto lleva una configuracion, aca indico desde donde se puede acceder o no, sino indico nada se puede acceder desde cualquier servidor q sea distinto de donde esta alojada la API. 

//users routing
//primero pongo la ruta- luego requiero al archivo en que envio el req para resolverlo
server.use("/api/users", require("./users/userRt"));


server.listen(PORT,(err)=> { //le decimos que el servidor escuche peticiones en un puerto 3030 
!err ?
    console.log(`server up: http://localhost:${PORT}`)
    :
    console.log(`server down du to: ${err}`);
});
                                 