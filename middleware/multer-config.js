
const multer = require('multer');
const sharp = require ('sharp');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
};

const storage = multer.diskStorage({
    // route pour stocker les fichiers
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // cree le nom du fichier
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');

const convertToWebp = (req, res, next) => {
    // verifier si une image a etait chargé 
    if (req.file && req.file.path) {
        const originalImagePath = req.file.path;
        // mettre l'extention webp pour optimiser le stockage
        const outputPath = req.file.path.replace(/\.[^.]+$/, '.webp');
        
        // convertir l'image et la save avec sharp
        sharp(originalImagePath)
            .toFormat('webp')
            .resize({
                width: 602,
                height: 650,
                fit: 'cover'
            })
            .toFile(outputPath)
            .then(() => {
                // on suprimer le ficher de base si existant
                if (fs.existsSync(originalImagePath)) {
                    fs.unlinkSync(originalImagePath);
                }
                // mettre a jour dans images
                req.file.path = outputPath.replace('images\\', '');
                next();
            })
            .catch(error => {
                console.error('Error converting image to webp:', error);
                next();
            });
    } else {
        
        next();
    }
};

module.exports.convertToWebp = convertToWebp;
