require("dotenv").config() //importamos dotenv para que lo pueda leer el proyecto 
require("./config/db") //requerimos el archivo de configuracion de la Base de datos

const express = require ('express') //requerimos express. En la const express ponemos todo lo de 'express'
const server = express() //creamos nuestro servidor. En server estan todos los archivos de express. si escribo server. me aparecen todos los metodos que tiene express Ej: server._router   server.addListener  server.get
const PORT = process.env.PORT || 3030; 

server.get('/api', (req, res)=> {//creo el servidor y hago una peticion de tipo get, o sea pido algo. Dentro escribo la ruta e ingreso un callback e donde esta la peticion y la respuesta. 
//programo mi servidor para que acepte en la ruta '/' una peticionn de tipo get. 
res.sendStatus(200);
}) 

server.get('/api/teams', (req, res)=> { //obtenemos un recurso
    res.send("accedemos a los equipos");
})  
    

server.post('/api/teams', (req, res)=> { //agregamos un recurso
    res.send("agregamos un equipo");
})  
    
server.delete('/api/teams/:id', (req, res)=> {  //borramos un recurso a traves del id.
    res.send("Borramos el equipo " + Number(req.params.id));
});
    
server.use(express.static("public"));

server.listen(PORT,(err)=> { //le decimos que el servidor escuche peticiones en un puerto 3030 
!err ?
    console.log(`server up: http://localhost:${PORT}`)
    :
    console.log(`server down du to: ${err}`);
});
