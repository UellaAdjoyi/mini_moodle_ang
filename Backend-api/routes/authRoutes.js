const experess = require('express');
const router = experess.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe); // Route protégée pour obtenir les infos de l'utilisateur connecté


module.exports = router;