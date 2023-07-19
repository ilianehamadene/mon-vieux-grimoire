const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.js')
const bookRouter = require('./routes/book.js')
// Se connecter a Mongo Db atlass
mongoose.connect('mongodb+srv://iliane:5lC6faMGINltKgwN@cluster0.izvknpm.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
const path = require('path');


// recuperer le contenu de toutes les requetes avec du JSON
app.use(express.json())
// gestion des CORS pour les routes
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});

// cree les routes 
app.use('/api/books' , bookRouter);
app.use('/api/auth' , userRouter);
app.use('/images', express.static(path.join(__dirname, '')));


module.exports = app;