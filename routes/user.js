const express = require('express');
const router = express.Router();
const User = require('../model/user')
const userCtrl = require('../routes/controllers/user');


router.post('/signup', userCtrl.signUp)
router.post('/login', userCtrl.login)

module.exports = router ;