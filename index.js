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
                      
//404
server.use((req, res, next)=>{ //decimos que el servidor haga uso de una req y una res, e introducimos la funcion next, cdo la invoco pasa el control a la siguiente instruccio
    let error = new Error(); // Es un objeto de la clase error, por lo cual tiene su status
    error.message ="resource not found"; //resource son los recursos o datos.
    error.status = 404; //el status es el codigo de estado que le devolves a la API
    next(error) //le indica que pase el error, al siguiente manejador de errores, al error handling
})  

//General Error handling (o manejador de errores en general). Si la anterior funcion para manejar el error fallo, esta maneja el resto para que no detone el programa.
server.use((error, req, res, next)=>{ //como de aca no voy a ningun lado no necesito poner next 
  res
    .status(error.status)
    .json({status: error.status, message: error.message}) //la respuesta la hago aca
});