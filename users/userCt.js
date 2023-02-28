//importamos el modelo que me permite interactuar con los datos. 
const User = require("./userMd")

//get all users. Creo las funciones que luego voy a llamar en el userRt.js
const getAllUsers = (req, res) => {
   User.find().then((data) => {//mongoose tiene un metodo para buscar todo, al que llamo con User.
      !data.length ? res.json({message: "not found"}).sendStatus(404) : res.json(data).status(200);
      res.json(data);
   }).catch((error) => console.log(error));
};

//

//delete user by id
const deleteUserById = (req, res) => {
    res.send(`<> Estamos en el enrutador de ${req.baseUrl}. Vamos a borrar el resource id: ${req.params.id}`);
};

//exportamos el modulo con las funciones que hicimos
module.exports = { getAllUsers, deleteUserById };