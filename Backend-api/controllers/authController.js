const generateToken = require('../utils/generateToken');
const User = require('../models/user');
const { createLogEntry } = require('../utils/logger');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
    }

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
            await createLogEntry(user._id, 'connexion');
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
  getUserCourses,
  removeUserCourse,
};