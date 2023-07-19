const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('./controllers/book');
const { convertToWebp } = require('../middleware/multer-config');


router.get('/', stuffCtrl.getAllBook);
router.delete('/:id', auth, stuffCtrl.deleteBook);
router.get('/bestrating', stuffCtrl.getBestRating);
router.get('/:id', stuffCtrl.getOneBook);
router.post('/', auth, multer, convertToWebp, stuffCtrl.createBook);
router.put('/:id', auth, multer, convertToWebp, stuffCtrl.modifyBook);
router.post('/:id/rating', auth, stuffCtrl.rateBook);

   module.exports = router ;