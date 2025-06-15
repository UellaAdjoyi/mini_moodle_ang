const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const generatePassword = require('../utils/generatePassword');
const User = require('../models/user');
const Ue = require('../models/Ue');
const { createLogEntry } = require('../utils/logger');





const loginUser = async (req, res) => {
  // On utilise 'email' pour la connexion, comme c'est le champ unique standard
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
    }

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });

    // Vérifier si l'utilisateur existe ET si le mot de passe correspond (méthode matchPassword du modèle)
    if (user && (await user.matchPassword(password))) {
      // Créer un log de connexion APRÈS succès
            await createLogEntry(user._id, 'connexion'); // Aucune cible spécifique pour le login simple
      res.json({
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        photo: user.photo,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe invalide.' }); // 401 Unauthorized
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la tentative de connexion.' });
  }
};

const getMe = async (req, res) => {
  // req.user est fourni par le middleware `protect` et contient l'objet utilisateur (sans le mot de passe)
  // directement depuis la base de données.
  try {
    // L'utilisateur est déjà chargé par le middleware `protect` dans `req.user`
    // On peut vouloir le "re-chercher" si on veut des données très à jour ou populer des champs.
    // Mais pour l'instant, req.user devrait suffire si le middleware fait bien son travail.

    // const user = await User.findById(req.user._id).select('-password').populate('cours.ue_id', 'nom code');
    // if (user) {
    //    res.json(user);
    // } else {
    //    res.status(404).json({ message: "Utilisateur non trouvé" });
    // }
    
    // Si req.user est déjà bien populé par le middleware (ce qui est le cas avec notre `authMiddleware.js` actuel)
    if (req.user) {
        res.json(req.user); // req.user contient déjà _id, nom, prenom, email, role, photo
    } else {
        // Ce cas ne devrait pas être atteint si le middleware `protect` fonctionne correctement
        res.status(404).json({ message: "Utilisateur non trouvé ou non authentifié." });
    }

  } catch (error) {
    console.error('Erreur dans getMe:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des informations utilisateur.' });
  }
};



const getUserCourses = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.status(200).json(user.cours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

removeUserCourse = async (req, res) => {
  const { userId, ueId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Suppression de l'UE
    user.cours = user.cours.filter(ue => ue.ue_code.toString() !== ueId);
    console.log('UE ID à retirer:', ueId);
    console.log('Liste avant:', user.cours.map(c => c._id.toString()));

    await user.save();

    res.json({ message: 'UE retirée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  loginUser,
  getMe,
  getUserCourses,
  removeUserCourse,
};