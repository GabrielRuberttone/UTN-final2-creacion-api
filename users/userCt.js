//importamos bcrypt
const bc = require("../utils/handlePassword")
//importamos el modelo que me permite interactuar con los datos. 
const User = require("./userMd")
//importamos en .env para traer la url que vamos a usar en imagen
const public_url = process.env.public_url;
const jwt = require("../utils/handleJWT"); //importamos el token
const transporter = require("../utils/handleMailer") //importamos el manejador de email

const { link } = require("fs"); //ESTO NO LO TIENE EL PROFESOR EN CODIGO 00:47:12 video clase 23

// get all users. Creo las funciones que luego voy a llamar en el userRt.js
const getAllUsers = (req, res, next) => {//agregamos la funcion next para manejar errores
   User.find().then((data) => {//mongoose tiene un metodo para buscar todo, al que llamo con User.
      !data.length 
      ? next() //le agregamos el next 
      : res.status(200).json(data);
      // res.json(data); NOTA TIRABA ERROR: en un foro dijeron que era porq habia dos res, borre y funciona. 
   }).catch((error) => {
      error.status =500 
      next(error) //de aca vamos al middleware de errores. 
   });
};

// const getAllUsers = (req, res) => {
//   res.send(`<h2> Estamos en el enrutador de ${req.baseUrl}`)
// };

//create User
const createUser = async (req, res,next) => {
 let pic = ""; //lo hacemos para que no rompa el codigo si el usuario no carga una imagen.
 if(req.file){ //si viene un archivo
   pic = `${public_url}/storage/${req.file.filename}` //quiero la url del archivo - el archivo viene aca: req.file.filename 
 } 

 //Encriptamos la password: antes de enviar lo que puso el usuario en el formulario a la base de datos, tenemos que encriptar la contraseña. 
 const password = await bc.hashPassword(req.body.password) //con req.body.password traemos la contrasena q pone el usuario.

 //Envio los datos a la Base de Datos:
  const newUser = new User({...req.body, profilePics: pic, password}); //1 creamos un nuevo usuario, que es una instancia de una clase. 
   newUser.save((error, result)=>{
     console.log(result);
     if (error) {
      error.status = 400;
      next(error);
      } else {
       res.status(200).json(newUser);//CAMBIO DE CODIGO!!!  res.status(200).json(result); -- asi funciona:  res.status(200).json(newUser);
     }
  });
};

//update user:
const updateUser = async (req, res, next) => { //creamos una constante  que se llame updateUser
try {
   const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true}); //utilizamos el metodo findByIdAndUpdate. Como primer parametro recibimos el id que sirve para encontrarlo, y como segundo parametro el body completo. Para que funcione le tengo que pasar un id y tambien un body. 
//Si quiero recibir el dato actualizado, y no como estaba antes, a la petición tengo que colocarle {new: true}
res.status(200).json({message:"Usuario con cambios", usuario:user});

} catch (error) {
next()
}
};


//Delete user by id. Como es una operacion asincronica la manejamos con async/await
const deleteUserById = async (req, res, next) => {
try {
   const user = await User.findByIdAndDelete(req.params.id) //req.params.id ahí esta el id cuyo dato queremos encontrar para su borrado en la BD
   res.status(200).json({user: user.id, message: "Usuario borrado."})//elijo status (en vez de sendStatus) porque quiero personalizar el mensaje. Como buena practica porque estamos en una api elijo el formato JSON
}catch(error){ //usamos un try/cach pero podemos usar otra cosa tambien
next();
}
};

//Login (en un proyecto real seria conveniente tener un servicio de autorizacion y autenticacion con el manejo register y login )
const loginUser = async (req, res, next) => {//es asincronico porque hay una operacion conntra una BD en el medio. Ponemos next porque estamos usando un manejador de errores.
  const user = await User.find().where({email: req.body.email}); //1 lo primero que hacemos es ver si el usuario existe, para ello usamos un metodo .find() y le agregamos un predicado .where() aqui ponemos con lo que debe coincidir para la busqueda. 
  let error = new Error("Email or password invalid")//usamos el handle de errores
  if (!user.length) {//2 vemos si el objeto que nos devuelve esta vacio, si es asi no encontro ese email en la BD. !user.length significa si la longitud es igual a 0.
   error.status = 401;
   return next(error);
  }
 //2 si llego aca el email existe en la BD, lo siguiente es desencriptar la password de la BD y compararla con la que ingreso el usuario
 const hashedPassword = user[0].password; //iteramos sobre el objeto user que encontre en la BD que coincido con el email que me pasaron en el proceso de login
 const match = await bc.checkPassword(req.body.password, hashedPassword); //traemos el metodo de bcrypt para comparar passwor que recibe las 2 passwords a comparar: al que viene del form primero y despues la que viene de la BD
 if (!match) {
   return res.status(401).json({message: "Email or password invalid"}); //ESTA DISTINTO AL PROFE
 }
 // res.sendStatus(200);//probamos si lo hace bien. Si llegamos a esta linea GENERAMOS EL TOKEN!

 //Gestion del Token
 const userForToken = { //1 generamos un usuario para el token, es nuestro payload
      email: user[0].email,
      fullName: user[0].fullName,
      userName: user[0].userName
   }
 const accessToken = await  jwt.tokenSign(userForToken, "24h") //2 aca generamos el token (payload  + tiempo de expiracion) 
 res.status(200).json({
   message: "access granted", 
   Token: accessToken,
   userData: userForToken //si queremos, asi mostramos los datos del usario
})  //enviamos la respuesta al frontEnd quien tiene que guardar el token
};

/*FORGOT PASSWORD (este servicio enviara un email con un link de recuperacion de contrasena, el email del usuario registrado 
en la base de datos. Desde ese link, que incluira un token de seguridad podremos ir al formulario de recuperacion y este 
vinculara con el procedicmiento de restauracion de contrasena -> esta se va a persistir en la BD.)*/
const forgot = async(req, res, next)=>{ 
 let error = new Error("No user with than email");  //1 como voy a tener que trabajar con un error lo voy a ir definiendo. 
 const user = await User.find().where({email: req.body.email}) //2 existe el mail? (esto devuelve un arreglo, si viene vacio es xq no existe el email en la BD)
 if(!user.length){ //si viene vacio hace esto
   error.status = 404;//no necesito poner el message del error porque ya lo puse al definir el error en let error = new Error...
   return next(error)// esto va al middelware de errores.
 } 
 //si existe el email generamos el token de seguridad y el link de recuperacion que enviaremos al user
 const userForToken ={  //creamos el usuario que le ponemos el link de seguridad. Es un objeto:
   id:user[0].id,     //traemos el id.
   name: user[0].fullName,
   email: user[0].email //ya tengo mi objeto con datos del usuario para poner dentro del token
 }
 const token = await jwt.tokenSign(userForToken, "15m")//ahora creamos el token y le ponemos los datos del usuario y el tiempo en que expira.
 const link = `${process.env.public_url}/api/users/reset/${token}`//generamos el link que incluye la url y el token, y creamos una ruta llamada reset 


 //creamos el cuerpo de email, lo enviamos al usuario del mail e indicamos esto en la response
 const mailDetails = {
   from: "Tech-Support@mydomain.com",
   to: userForToken.email,
   subject: "Password recovery magic link",
   html:`<h2> Password Recovery service </h2> 
   <p> To reset your password, please click the link and type in a new password </p>
   <a href="${link}"> click to reset password </a>
   ` 
 };
 transporter.sendMail(mailDetails, (error, data)=>{
   if(error){ //preguntamos si hay un error en el envio
      next(error)
   } else {//si no hay error 
   res.status(200).json({ message:`Hi ${userForToken.name}, we' ve sent an email whit instructions to  ${userForToken.email}`}) //envia el mail con las instrucciones
   }
 });
}

//hacemos algo sencillo para probar
const reset  = async (req, res, next) =>{
const {token} = req.params;
const tokenStatus = await jwt.tokenVerify(token);
if(tokenStatus instanceof Error) {
   return next (tokenStatus);
} res.render("reset", {token, tokenStatus});
};

//guardamos la nueva password
const saveNewPass = async (req, res, next ) =>{
const {token} = req.params;//traemos el token que esta en la req
const tokenStatus = await jwt.tokenVerify(token);
 if(tokenStatus instanceof Error) return next (tokenStatus);//si paso de esta linea no hubo error
 const newPassword = await bc.hashPassword(req.body.password_1)
 //ahora actualizamos el usuario, al usuario le cambiamos la contrasena
 try{
const updateUser = await User.findByIdAndUpdate(tokenStatus.id, {
password: newPassword}); //guardamos el usuario actualizado
res.status(200).json({message: `Password changed for user ${tokenStatus.name}`})//resuelvo la aplicacion para que no quede dando vueltas el form
 }catch(error){
   next(error)
 }
};

//exportamos el modulo con las funciones que hicimos
module.exports = { getAllUsers, deleteUserById, createUser, updateUser, loginUser, forgot, reset, saveNewPass };
