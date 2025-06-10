const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

let users = [];

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Veuillez fournir un nom d_utilisateur, un email et un mot de passe' });
  }

  // Vérifier si l'utilisateur existe déjà (par email ou username)
  const userExists = users.find(u => u.email === email || u.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
  }

  // Hacher le mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    id: uuidv4(),
    username,
    email,
    password: hashedPassword,
    role: role || 'student', // Rôle par défaut si non fourni
  };

    users.push(newUser);

     // Ne pas renvoyer le mot de passe hashé
  const userResponse = { ...newUser };
  delete userResponse.password;

  res.status(201).json({
    ...userResponse,
    token: generateToken(newUser.id),
  });
};

// @desc    Authentifier un utilisateur et obtenir un token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: 'Veuillez fournir un email/nom d_utilisateur et un mot de passe' });
  }

  // Trouver l'utilisateur par email ou username
  const user = users.find(u => u.email === emailOrUsername || u.username === emailOrUsername);

  if (user && (await bcrypt.compare(password, user.password))) {
    // Ne pas renvoyer le mot de passe hashé
    const userResponse = { ...user };
    delete userResponse.password;

    res.json({
      ...userResponse,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: 'Identifiants invalides' }); // 401 Unauthorized
  }
};


const getMe = (req, res) => {
  // req.user est ajouté par le middleware de protection
  const userFromDb = users.find(u => u.id === req.user.id);
  if (userFromDb) {
    const userResponse = { ...userFromDb };
    delete userResponse.password;
    res.json(userResponse);
  } else {
     // Ce cas est peu probable si le token est valide et que l'utilisateur n'a pas été supprimé entre-temps
     res.status(404).json({ message: "Utilisateur non trouvé après vérification du token" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getMe, // On ajoutera une route pour cela
};