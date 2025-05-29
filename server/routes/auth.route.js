const express = require('express');
const { login, logout, signup, getMe } = require('../controllers/auth.controller.js');
const { protectRoute } = require('../middlewares/protectRoute.js')

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectRoute, getMe);

module.exports = router;