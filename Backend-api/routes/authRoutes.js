const express = require('express');
const router = express.Router();
const {
    loginUser,
} = require('../controllers/authController');

const {
    registerUser,
     getAllUsers,
    updateUser,
    deleteUser,
    updateProfile,
    getUserPhoto,
    assignUeToUser,
    removeUeFromUser,
    getUserCourses, resetPassword
} = require('../controllers/userController');
const { protect,admin} = require('../middlewares/authMiddleware');
const authenticateUser = require("../middlewares/authenticateUser");
const {uploadSingle} = require("../middlewares/uploadUsers");


// Route pour l'enregistrement
router.post('/register',uploadSingle ,registerUser);
router.put('/updateUser/:id', uploadSingle, updateUser);
router.get('/photo/:id', getUserPhoto);

// Route pour la connexion
router.post('/login', loginUser);

// Route pour récupérer les infos de l'utilisateur connecté (protégée)
router.post('/assign-ue/:userId', assignUeToUser);

router.get('/users', getAllUsers);
router.delete('/deleteUser/:id', deleteUser);
router.put('/profile', protect, uploadSingle, updateProfile);
router.get('/profile', authenticateUser, (req, res) => {
    const user = req.user;
    res.json({
        nom: user.nom,
        prenom: user.prenom,
        dtnaiss: user.dtnaiss,
        photoUrl: user.photoUrl,
        roles: user.roles
    });
});
router.post('/reset-password', resetPassword);
router.delete('/users/:userId/cours/:ueId', removeUeFromUser);
router.get('/:id/cours', getUserCourses);

module.exports = router;