const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
    // recupere le token apres le bearer
       const token = req.headers.authorization.split(' ')[1];
       // decode le token avec verify
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       // don prend le user id pour l'envoyer au future request pour les routes 
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
    next();
    //gere les erreurs
   } catch(error) {
       res.status(401).json({ error });
   }
};