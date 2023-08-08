
const multer = require('multer');
const sharp = require ('sharp');
const fs = require('fs');
const path = require('path')

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
        callback(null, name.split('.')[0] + '_' + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');

const convertToWebp = async (req, res, next) => {
    if(req.file){
        //Changer le type d'image en webp
        const newFileName = req.file.filename.split(".")[0]
        req.file.filename = newFileName + ".webp"
        const newName =newFileName + ".webp"
        // Compresser l'image
        await sharp(req.file.path).resize(400).toFile(path.resolve(req.file.destination, newName))
        fs.unlinkSync(req.file.path)
    }      
    next()
}

module.exports.convertToWebp = convertToWebp;