const express = require("express");
const path = require('path');
const exphbs = require('express-handlebars');
//Incializar
const app = express();
//Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));
app.set('view engine', '.hbs')

//Midelware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Rutas
app.use(require("./routes/index"));
app.use(require("./routes/registro"));


// Public 
app.use(express.static(path.join(__dirname, 'public')));
//Inicar Sevidor
app.listen(app.get('port'), () => {
    console.log('El servidor se inicion en el puerto ', app.get('port'))
});