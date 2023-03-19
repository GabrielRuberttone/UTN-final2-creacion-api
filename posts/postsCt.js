const Post = require ("./postsMd") //nos traemos el modelo de los posteos para introducir el indice que creamos


//list all posts (esta no necesita autorizacion, todos pueden listarla)
const listAllPosts = (req, res, next ) =>{ //como es asincronico lo podemos hacer con promesas o con sync y await. Ponemos next para manejar los errores.
// res.status(200).json({message: "all post listed"}); //es para que muestre algo y no rompa, como hacer un console.log  
    Post.find().then((data) => {//el metodo find() de moongose sirve para buscar todo, al que llamo con User.
       !data.length //si no viene la data 
       ? next() //le agregamos el next y nos lleva a un 404
       : res.status(200).json(data);//si vino la data, la muestra. 
    }).catch((error) => {//si hay error me tira un codigo 500 
       error.status =500 
       next(error) //de aca vamos al middleware de errores. 
    });
};

//find by title
const finByTitle = (req, res, next) =>{
    const {query} = req.params; //extraemos del body el parametro
    Post.find({$text: {$search: query}}, //dentro del find le pasamos un objeto que va a buscar 'text'
    (err, result) => {
        if (err) return next();
           return res.status(200).json({result})
    });
};

//create new post
const createNewPost = async (req, res, next) =>{
    const newPost = new Post({...req.body});//1 creamos una nueva instancia, o sea un posteo. Dentro tiene un objeto con: ...req.body -todo lo q venga en el body-
    newPost.save((error) =>{ //2 lo guardamos en la BD: newPost.save(), y vemos si hay error
    if (error) return next(error);  //3 si hay error retorna next error, luego lo podemos arreglar de acuerdo a como viene ese objeto y la info que tenga
        res.status(200).json({message: "New post saved ok"});//4 si no hay error tiro un estado 200 y un json que el post fue creado correctamente.
    })
}

module.exports = {listAllPosts, finByTitle, createNewPost} //exporto los metodos que haga en el modulo