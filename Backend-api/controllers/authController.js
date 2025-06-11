const generateToken = require('../utils/generateToken');
const User = require('../models/User'); // <-- IMPORTER LE MODÈLE MONGOOSE


// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  // Récupérer les champs selon votre nouveau modèle User
  const { nom, prenom, email, password, role, photo, serviceProf, bureauProf } = req.body;

  try {
    // Validation des champs requis
    if (!nom || !prenom || !email || !password || !role) {
      return res.status(400).json({ message: 'Veuillez fournir nom, prénom, email, mot de passe et rôle.' });
    }

    // Vérifier si l'utilisateur existe déjà par email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Créer l'utilisateur
    // Le hachage du mot de passe est géré par le middleware 'pre-save' dans le modèle User.js
    const user = await User.create({
      nom,
      prenom,
      email,
      password, // Le modèle s'occupe du hachage
      role,
      photo: photo || null, // Optionnel
      serviceProf: role === 'prof' ? serviceProf : null, // Conditionnel au rôle
      bureauProf: role === 'prof' ? bureauProf : null,   // Conditionnel au rôle
      cours: [] // Initialiser avec un tableau de cours vide
    });

    if (user) {
      // Renvoyer les informations de l'utilisateur et le token
      res.status(201).json({
        _id: user._id, // MongoDB utilise _id
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        photo: user.photo,
        // Ne pas renvoyer serviceProf et bureauProf ici à moins que nécessaire pour le client immédiatement
        token: generateToken(user._id), // Utiliser user._id pour le token
      });
    } else {
      // Ce cas est moins probable si User.create réussit sans erreur, mais pour la robustesse
      res.status(400).json({ message: 'Données utilisateur invalides, enregistrement échoué.' });
    }
  } catch (error) {
    console.error('Erreur lors de l_enregistrement:', error);
    // Gérer les erreurs de validation Mongoose spécifiques
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    // Gérer les erreurs de clé dupliquée (par exemple, si l'email est unique et qu'il y a une race condition)
    if (error.code === 11000) {
        return res.status(400).json({ message: 'L_email fourni est déjà utilisé.'});
    }
    res.status(500).json({ message: 'Erreur serveur lors de l_enregistrement de l_utilisateur.' });
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


module.exports = {
  registerUser,
  loginUser,
  getMe,
};