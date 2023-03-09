//importamos bcrypt
const bc = require("../utils/handlePassword")

//importamos el modelo que me permite interactuar con los datos. 
const User = require("./userMd")

// get all users. Creo las funciones que luego voy a llamar en el userRt.js
const getAllUsers = (req, res) => {
   User.find().then((data) => {//mongoose tiene un metodo para buscar todo, al que llamo con User.
      !data.length ? res.json({message: "not found"}).sendStatus(404) : res.json(data).status(200);
      res.json(data);
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

//delete user by id
const deleteUserById = (req, res) => {
    res.send(`<> Estamos en el enrutador de ${req.baseUrl}. Vamos a borrar el resource id: ${req.params.id}`);
};

//exportamos el modulo con las funciones que hicimos
module.exports = { getAllUsers, deleteUserById, createUser };