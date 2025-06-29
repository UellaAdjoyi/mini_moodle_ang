const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Non authentifié ou rôle utilisateur manquant.' });
    }

    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];

    const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ message: 'Accès non autorisé. Vous n_avez pas les permissions requises.' });
    }
    next();
  };
};

module.exports = { authorize };