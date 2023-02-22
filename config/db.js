
//Mongo DB Atlas cloud connection (mongo atlas es la nube dode esta desplegada la BD)
const mongoose = require('mongoose')//importamos 



//a partir de la version 6 de mongoose no es necesario, aunque quizas alguna vez necesitamos configurar algo
const options ={
    maxPoolSize: 100,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

//nos traemos nuestro string de conexion
const db_uri = process.env.db_uri
mongoose.set('strictQuery', false)//hicimos esto porq daba un error 
//establecemos la conexion, podemos hacerla solamente trayendo db_uri o poniendole options, y hasta un error. 

mongoose.connect(db_uri, options, (err)=>{
err ? console.log(`No se pudo conectar a Mongo Atlas: ${err.message}`)
:
console.log('Se conecto correctamente a Mongo Atlas. OK!!!!')
});
