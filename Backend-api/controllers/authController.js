const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const generatePassword = require('../utils/generatePassword');
const User = require('../models/user');
const Ue = require('../models/Ue');


const registerUser = async (req, res) => {
  const { nom, prenom, email, role, serviceProf, bureauProf } = req.body;
  const photoFile = req.file;

  try {
    if (!nom || !prenom || !email || !role) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }

    const generatedPassword = generatePassword();

    const newUser = new User({
      nom,
      prenom,
      email,
      password: generatedPassword, // le mot de passe sera hashé dans le modèle
      role,
      photo: photoFile ? photoFile.buffer : null,
      serviceProf: role === 'ROLE_PROF' ? serviceProf : null,
      bureauProf: role === 'ROLE_PROF' ? bureauProf : null,
      cours: []
    });

    await newUser.save();

    await sendEmail(
        email,
        'Votre compte a été créé',
        `Bonjour ${prenom},\n\nVoici votre mot de passe de connexion : ${generatedPassword}\n\nMerci de le modifier dès votre première connexion.`
    );

    res.status(201).json({ message: 'Utilisateur enregistré et email envoyé.' });
  } catch (error) {
    console.error('Erreur dans registerUser:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getUserPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('photo');
    if (!user || !user.photo) {
      return res.status(404).json({ message: 'Photo non trouvée' });
    }

    res.set('Content-Type', 'image/png'); // ou 'image/jpeg' si tu veux
    res.send(user.photo);
  } catch (error) {
    console.error('Erreur photo utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Modifier un utilisateur
// @route   PUT /api/auth/updateUser/:id
// @access  Admin ou Authentifié
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const fields = ['nom', 'prenom', 'email', 'password', 'date_naissance', 'service_prof', 'bureau_prof', 'dernier_acces', 'role'];

    fields.forEach(field => {
      if (req.body[field]) user[field] = req.body[field];
    });

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};


// @desc    Authentifier un utilisateur et obtenir un token
// @route   POST /api/auth/login
// @access  Public
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

// @desc    Obtenir les informations de l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private (nécessite le middleware de protection)
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès", user: deletedUser });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const fields = ['nom', 'prenom', 'email', 'password', 'date_naissance', 'serviceProf', 'bureauProf'];

    fields.forEach(field => {
      if (req.body[field]) user[field] = req.body[field];
    });

    // Gérer l'upload photo si tu utilises multer (cf. plus bas)
    if (req.file) {
      // Si tu stockes la photo en Buffer (comme à l'inscription)
      user.photo = req.file.buffer;
    }

    await user.save();

    res.json({
      message: "Profil mis à jour avec succès",
      user: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        photo: user.photo,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Erreur updateProfile:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil.' });
  }
};

const assignUeToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { ueId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const ue = await Ue.findById(ueId);
    if (!ue) return res.status(404).json({ message: 'UE non trouvée' });

    const alreadyAssigned = user.cours.some(c => c.ue_code?.toString() === ueId);
    if (!alreadyAssigned) {
      user.cours.push({
        ue_code: ue._id.toHexString(),
        nom: ue.nom,
        imageUe: ue.image || null,
        dernierAcces: new Date()
      });
      await user.save();
    }

    res.status(200).json({ message: 'UE assignée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const removeUeFromUser = async (req, res) => {
  try {
    const { userId, ueId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.cours = user.cours.filter(c => c._id.toString() !== ueId);
    await user.save();

    res.status(200).json({ message: "UE retirée avec succès", cours: user.cours });
  } catch (error) {
    console.error("Erreur lors du retrait de l’UE :", error);
    res.status(500).json({ message: "Erreur serveur", error });
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
    user.cours = user.cours.filter(ue => ue._id.toString() !== ueId);
    console.log('UE ID à retirer:', ueId);
    console.log('Liste avant:', user.cours.map(c => c._id.toString()));

    await user.save();

    res.json({ message: 'UE retirée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  updateUser,
  deleteUser,
  updateProfile,
  getUserPhoto,
  assignUeToUser,
  removeUeFromUser,
  getUserCourses,
  removeUserCourse,
};