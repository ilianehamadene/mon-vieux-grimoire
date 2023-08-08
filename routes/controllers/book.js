const Book = require('../../model/book');
const fs = require('fs');


exports.createBook = (req, res, next) => {

    // JSON reponse en object
  const bookObject = JSON.parse(req.body.book);
  // Suppression des id pour la securité
  delete bookObject._id;
  delete bookObject._userId;


  //Nouvelle instance de notre model book 
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      //creation de l'url pour l'image chargé
      imageUrl: `${req.protocol}://${req.get('host')}/images/images/${req.file.filename}`
  });
//Sauvegarde dans la BDD
  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};



exports.getAllBook = (req, res, next) => {
    // Recupere tous les livres
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

  
  exports.modifyBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then((book) => {

        // verifie si l'image change ou non 
        if(req.file) {

            // converti la requete JSON en objet si il y a une image 
            const bookObject = {
                ...JSON.parse(req.body.book),
                imageUrl: `${req.protocol}://${req.get('host')}/images/images/${req.file.filename}`
            };
            // verifie l'user pour autorisation
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non-autorisé'});
            } else {
                // supprime l'ancienne photo si il a (du backend)
                const fileToDelete = book.imageUrl.split('/images/images/')[1];
                fs.unlink(`images/${fileToDelete}`, () => {
                    // Mise a jour du livre
                    Book.updateOne({ _id: req.params.id}, {...bookObject, _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Livre modifié !'}))
                    .catch(error => {res.status(400).json({ error })})
                });
            }      
        } else {
             // Si pas d'image on utilise la data du req.body
            const bookObject = {
                ...req.body
            };
            // verifie l'user pour autorisation
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non-autorisé'});
            } else {
                // Mise a jour du livre
                Book.updateOne({ _id: req.params.id}, {...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({ message: 'Livre modifié !'}))
                .catch(error => {res.status(400).json({ error })})
            }
        }  
    })
    .catch((error) => {
        res.status(400).json({ error })
    });
};




  exports.getOneBook = (req, res, next)=>{
    // recupere un seul livre en fonctionn de l'id dans l'url 
    Book.findOne( {_id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
   };

   exports.deleteBook = (req, res, next) => {

    // Recupere le livre avec l'id
    Book.findOne({ _id: req.params.id })
        .then((book) => {

            // Verifie si l'user est autorisé a supprimer 
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Unauthorized request' });
            } else {

                // Supprime du backend end (dossier images)
                const filename = book.imageUrl.split("/images/images")[1];
                fs.unlink(`images/${filename}`, () => {

                    // supime de mongo DB
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: 'livre supprimé !',
                            });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
    });
};



 exports.getBestRating = (req, res, next) => {
    Book.find()
    .then((books) => {
        // compare 1 par 1 pour resortir les 3 meilleurs 
        const bestRatingSort = books.sort(
            (a, b) => b.averageRating - a.averageRating
        );
        //garde que les 3 meillieur 
        const bestRating = bestRatingSort.slice(0, 3);
        res.status(200).json(bestRating);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.rateBook = (req, res, next) => {

    //on recupere les info du user et la note qu'il met 
	const url = req.url;
	const urlId = url.split('/')[1];
    //le livre en question 
	const bookFilter = { _id: urlId };
	const updatedUserId = req.body.userId;
	const updatedGrade = req.body.rating;

	const updatedData = {
		userId: updatedUserId,
		grade: updatedGrade,
	};

	Book.findOneAndUpdate(
		bookFilter,
        // envoie de la note au tableau
		{ $push: { ratings: updatedData } },
		{ new: true }
	)
		.then((updatedBook) => {
            // ajoue de la note 
			const totalRatings = updatedBook.ratings.length;
			const ratingsSum = updatedBook.ratings.reduce(
				(acc, rating) => acc + rating.grade,
				0
			);
            //calcul de la moyenne 
			updatedBook.averageRating = ratingsSum / totalRatings;

			return updatedBook.save();
		})
		.then((book) => {
			res.status(200).json(book);
		})
		.catch((error) => res.status(400).json({ error }));
};


