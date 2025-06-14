const Log = require('../models/Log');

// @desc    Récupérer tous les logs (avec pagination et filtres optionnels)
// @route   GET /api/logs
// @access  Private (admin)
const getAllLogs = async (req, res) => {
    try {
        // Options de pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;
        const skip = (page - 1) * limit;

        // Options de filtre (exemples)
        const filter = {};
        if (req.query.userId) filter.user_id = req.query.userId;
        if (req.query.action) filter.action = req.query.action;
        if (req.query.cibleType) filter.cible_type = req.query.cibleType;
        if (req.query.cibleId) filter.cible_id = req.query.cibleId;
        // On pourrait ajouter des filtres de date

        const logs = await Log.find(filter)
            .populate('user_id', 'nom prenom email') // Populer l'utilisateur
            // .populate('cible_id') // Populer la cible si refPath est bien configuré (plus complexe)
            .sort({ date_heure: -1 }) // Les plus récents en premier
            .skip(skip)
            .limit(limit);

        const totalLogs = await Log.countDocuments(filter);
        const totalPages = Math.ceil(totalLogs / limit);

        res.status(200).json({
            logs,
            currentPage: page,
            totalPages,
            totalLogs
        });

    } catch (error) {
        console.error('Erreur getAllLogs:', error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des logs." });
    }
};

module.exports = { getAllLogs };