//importamos bcrypt
const bc = require("../utils/handlePassword")

//importamos el modelo que me permite interactuar con los datos. 
const User = require("./userMd")

// get all users. Creo las funciones que luego voy a llamar en el userRt.js
const getAllUsers = (req, res) => {
   User.find().then((data) => {//mongoose tiene un metodo para buscar todo, al que llamo con User.
      !data.length ? res.json({message: "not found"}).sendStatus(404) : res.json(data).status(200);
      // res.json(data); NOTA TIRABA ERROR: en un foro dijeron que era porq habia dos res, borre y funciona. 
   }).catch((error) => console.log(error));
};

// const getAllUsers = (req, res) => {
//   res.send(`<h2> Estamos en el enrutador de ${req.baseUrl}`)
// };

//create User
const createUser = async (req, res) => {
 //console.log(req.body); // lo usamos para chequear si funciona

 //Encriptamos la password: antes de enviar lo que puso el usuario en el formulario a la base de datos, tenemos que encriptar la contraseña. 
 const password = await bc.hashPassword(req.body.password) //con req.body.password traemos la contrasena q pone el usuario.

 //Envio los datos a la Base de Datos:
  const newUser = new User({...req.body, password}); //1 creamos un nuevo usuario, que es una instancia de una clase. 
   newUser.save((error, result)=>{
     console.log(result);
     if (error) {
       res.status(400).json({message: error.message});//configuro el error cdo el nuevo usuario tien cosas duplicadas
      } else {
       res.status(200).json(newUser);
     }
  });
};

//update user:
const updateUser = async (req, res) => { //creamos una constante  que se llame updateUser
try {
   const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true}); //utilizamos el metodo findByIdAndUpdate. Como primer parametro recibimos el id que sirve para encontrarlo, y como segundo parametro el body completo. Para que funcione le tengo que pasar un id y tambien un body. 
//Si quiero recibir el dato actualizado, y no como estaba antes, a la petición tengo que colocarle {new: true}
res.status(200).json({message:"Usuario con cambios", usuario:user});

} catch (error) {
   res.status(404).json({ message: "Usuario no encontrado"});//copio lo mismo que el delete. Si no encuentra algo no lo puede actualizar. 
}
};


//Delete user by id. Como es una operacion asincronica la manejamos con async/await
const deleteUserById = async (req, res) => {
try {
   const user = await User.findByIdAndDelete(req.params.id) //req.params.id ahí esta el id cuyo dato queremos encontrar para su borrado en la BD
   res.status(200).json({user: user.id, message: "Usuario borrado."})//elijo status (en vez de sendStatus) porque quiero personalizar el mensaje. Como buena practica porque estamos en una api elijo el formato JSON
}catch(error){ //usamos un try/cach pero podemos usar otra cosa tambien
   res.status(404).json({ message: "Usuario no encontrado"});//si no encuentra el usuario, tira un 404 y un mensaje de usuario no encontrado.
}
};

//exportamos el modulo con las funciones que hicimos
module.exports = { getAllUsers, deleteUserById, createUser, updateUser };