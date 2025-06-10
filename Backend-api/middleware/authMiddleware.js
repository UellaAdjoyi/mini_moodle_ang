const jwt = require('jsonwebtoken');

// Notre "base de données" utilisateurs doit être accessible ici
// Pour l'instant, on la simule. Idéalement, on interrogerait la vraie BDD.
// On va importer le tableau users du authController pour la démo.
// ATTENTION: Ce n'est PAS une bonne pratique pour une vraie application.
// Dans une vraie app, vous feriez un User.findById() avec Mongoose.
const getMockUserById = (id) => {
  // Ceci est une simulation. Pour l'app finale, on fera une requête BDD.
  // Il faudrait trouver un moyen plus propre de partager 'users' si on reste en mock longtemps.
  // Pour l'instant, c'est juste pour faire fonctionner le middleware.
  // Le mieux serait de déplacer `users` dans un fichier `data/users.js` et l'importer dans les deux.
  // Mais pour simplifier pour l'instant :
  // const { users } = require('../controllers/authController'); // NE FAITES PAS CA EN PROD (dépendance circulaire potentielle)
  // On va supposer que si le token est valide, l'utilisateur existe pour la démo mock.
  // Dans une vraie app, on ferait : const user = await User.findById(decoded.id).select('-password');
  const mockUser = { id: id, username: 'mockuserfromtoken', email: 'mock@example.com', role: 'student' };
  if (id) return mockUser; // Simule la recherche
  return null;
};


const protect = async (req, res, next) => {
  let token;

  // Le token est généralement envoyé dans l'en-tête Authorization comme "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtenir le token de l'en-tête
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtenir l'utilisateur à partir du token (sans le mot de passe)
      // Dans une vraie application avec Mongoose :
      // req.user = await User.findById(decoded.id).select('-password');
      // Pour notre mock, on va simuler :
      req.user = getMockUserById(decoded.id); // Ceci devrait être remplacé par une recherche dans votre tableau 'users'
                                              // si vous voulez être plus précis avec le mock.
                                              // Pour la démo, on assume que si le token est valide, l'user existe.
      if (!req.user) {
          return res.status(401).json({ message: 'Non autorisé, utilisateur non trouvé pour ce token' });
      }

      next(); // Passe au prochain middleware ou à la route
    } catch (error) {
      console.error('Erreur de vérification du token:', error.message);
      res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Non autorisé, pas de token fourni' });
  }
};

module.exports = { protect };