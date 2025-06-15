const jwt = require('jsonwebtoken');
const User = require('../models/user');
const protect = async (req, res, next) => {
    let token;
    console.log('--- Protect Middleware ---'); // Log d'entrée
    console.log('Headers Authorization:', req.headers.authorization); // Log de l'en-tête

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token extrait:', token);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token décodé (decoded.id):', decoded.id);

            req.user = await User.findById(decoded.id).select('-password');
            console.log('Utilisateur trouvé (req.user):', req.user ? req.user._id : 'Non trouvé');

            if (!req.user) {
                console.log('Utilisateur non trouvé en BDD pour cet ID de token.');
                return res.status(401).json({ message: 'Non autorisé, utilisateur non trouvé pour ce token' });
            }

            console.log('Utilisateur attaché à req.user, appel de next()');
            next(); // Passe au prochain middleware ou à la route
        } catch (error) {
            console.error('Erreur dans le middleware protect (try-catch):', error.message);
            // Distinguer les erreurs de token invalide/expiré
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Non autorisé, token malformé ou invalide' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Non autorisé, token expiré' });
            }
            return res.status(401).json({ message: 'Non autorisé, problème avec le token' });
        }
    } else { // Ajout d'un else pour le cas où l'en-tête n'est pas bon
      console.log('Pas d_en-tête Authorization ou ne commence pas par Bearer.');
      // Si on arrive ici, c'est que token n'a pas été défini dans le if précédent
      // On peut aussi directement retourner une erreur ici au lieu de se fier au if(!token) plus bas
      return res.status(401).json({ message: 'Non autorisé, en-tête Authorization manquant ou malformé' });
    }

    // Ce bloc est maintenant un peu redondant si le `else` ci-dessus retourne une réponse,
    // mais on le garde pour le moment comme double sécurité.
    if (!token && !(res.headersSent)) { // Vérifier si une réponse n'a pas déjà été envoyée
        console.log('Aucun token trouvé après vérification de l_en-tête.');
        return res.status(401).json({ message: 'Non autorisé, pas de token fourni (vérification finale)' });
    }
};

// const admin = (req, res, next) => {
//     if (req.user && req.user.role === 'ROLE_ADMIN') {
//         next();
//     } else {
//         res.status(403).json({ message: 'Accès interdit. Réservé aux administrateurs.' });
//     }
// };


module.exports = {
    protect,
    // admin,
};