const multer = require('multer'); //importamos multer

//ahora llamamos un metodo de multer que se llama almacenamiento en disco. Tiene varios metodos
const storage = multer.diskStorage({ //vamos a indicuar cual es el destino y le vamos a pasar 3 parametros: la reques, el archivo y un callback
    destination:(req, file, cb) => {
         const pathStorage = `${__dirname}/../public/storage`;  //ahora indicamos cual es el camino a nuestro almacenamiento. Tenemos que indicar el path absoluto, no relativo de mi pc.
         cb(null, pathStorage);//asi lo dice la documentacion
         //cambio el nombre de archivo que cargo, por si se cargan dos con el mismo nombre para que no se repitan, no cambio la extension.
        },
        filename: (req, file, cb)=>{//tomo la extension del archivo y me la guardo. 
            const ext = file.originalname.split(".").pop()//creo un array para separar el nombre de la extension, para luego poner la extencion en el nuevo nombre.pop() devuelve el ultimo dato de un arreglo.
           const filename = `usrPic_${Date.now()}.${ext}`//generamos un nombre aleatorio y luego le pegamos la extension.
           cb(null, filename);
        }
})

//ahora creamos el midlleware
const uploadPic = multer({
    storage: storage,
    fileFilter:(req, file, cb)=>{  //filtramos el tipo de archivo con fileFilter para elejir que tipos puede cargar, y pasamos un callback
    if( //chequeo el tipo de archivo
     file.mimetype == "image/png" || //validamos la imagen por el tip de archivo mime, es una validacion robusta
     file.mimetype == "image/jpg" ||  
     file.mimetype == "image/jpeg"||
     !file //si no viene ninguno
    ){ //una vez que cheque los archivos de tipo mime devuelve el callback sin error 
        cb(null, true )
    } else { //si me da un archivo distinto devuelvo el callback y lo retornamos con un error 
        cb(null, false )
        return cb(new Error("Warning: .png, .jpg and .jpeg format allowed!"))
    }
},
});
module.exports = uploadPic;