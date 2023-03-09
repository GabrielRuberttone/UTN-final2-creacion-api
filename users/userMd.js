//traemos a mongoose
const mongoose = require("mongoose");

//Mongo DB schema. (creamos un eschema )
const userSchema = mongoose.Schema({
fullName: {type: String, require: true},
userName: {type: String, require: true, unique: true},
email: {type: String, require: true, unique: true},
profilePic: {type: String, default: ""}, //la imagen es string porque va a ir en una referencia a la base de datos y va a estar alojada en otro sitio
password: {type: String, require: true},
},
  {
     timestamps: true, //agrega los campos de fecha y hora created At y update At. Es de mongoose. 
  }
);

//al userSchema le seteamos algunas caracteristicas-No eliminamos de la BD, eliminamos de la Respuesta-
userSchema.set("toJSON", { //1- el primer seteo es que siga estando en formato json 
  transform (doc, ret){//2- luego pasamos lo que queremos transformar, para ello pasamos la funcion transform que recibe 2 parametros doc, ret 
    delete ret.__v;//3-no quiero que se vea ret. __versionn
    delete ret.password; //4- no quiero que se vea la password
  }      
});                


//Mongo DB model (es lo que me permite interactuar con los datos)
const User = mongoose.model("User", userSchema) //el modelo se basa en un schema

module.exports = User; 