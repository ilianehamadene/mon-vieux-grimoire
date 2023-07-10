const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('./controllers/book');


router.get('/', stuffCtrl.getAllStuff);
router.get('/:id', stuffCtrl.getOneThing);
// router.get('/:id/bestrating', stuffCtrl.getBestThing);
router.post('/', auth, multer, stuffCtrl.createThing);
router.put('/:id', auth, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
// router.post('/:id/rating', auth, stuffCtrl.createRating);

   module.exports = router ;