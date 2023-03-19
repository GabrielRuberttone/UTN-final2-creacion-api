const mongoose = require("mongoose"); //traemos mongoose

//creamos el schema
const Schema = mongoose.Schema

const PostSchema = new Schema ({ //recibe un objeto
    title: {type: String, require: true},
    body: {type: String, require: true},
    date: {type: Date, default: Date.now}, //es redundante porque vamos a usar timestamps
    comments: [{body: String, date: Date}], //es un arreglo ya que puede tener varios comentarios. Cada comentario tiene un body y se genera la fecha automaticamente
    hidden:{type: Boolean, default: false},  //este campo es para que el borrado sea fisico y se mantenga guardado. Por defecto la nota no esta escondida.
    meta: {
        votes: Number,
        favs: Number
    }
},
    {timestamps:true }
);

/* crea un indice para "find by title". Esto podria funcionar en posts/find:query   */
PostSchema.index({title: 'text'});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post; //exportamos el eschema
