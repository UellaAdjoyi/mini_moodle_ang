const express = require('express');
const router = express.Router();
const { // Fonctions du contrôleur d'authentification
    registerUser,
    loginUser,
    getMe, getAllUsers, updateUser, deleteUser, updateProfile, getUserPhoto, assignUeToUser
} = require('../controllers/authController');
const { protect,admin} = require('../middlewares/authMiddleware');
const upload= require('../middlewares/upload');
const authenticateUser = require("../middlewares/authenticateUser");


// Route pour l'enregistrement
router.post('/register', upload.single('photo'), registerUser);
router.put('/updateUser/:id', upload.single('photo'), updateUser);
router.get('/photo/:id', getUserPhoto);

// Route pour la connexion
router.post('/login', loginUser);

// Route pour récupérer les infos de l'utilisateur connecté (protégée)
router.get('/me', protect, getMe);
router.post('/assign-ue/:userId', assignUeToUser);

router.get('/users', getAllUsers);
router.delete('/deleteUser/:id', deleteUser);
router.put('/profile', protect, upload.single('photo'), updateProfile);
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

router.get('/users', getAllUsers);
router.delete('/deleteUser/:id', deleteUser);
router.put('/profile', protect, upload.single('photo'), updateProfile);
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

module.exports = router;