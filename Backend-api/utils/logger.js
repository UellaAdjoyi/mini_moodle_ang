const Log = require('../models/Log');

/**
 * Crée une entrée de log.
 * @param {string} userId - L'ID de l'utilisateur effectuant l'action.
 * @param {string} action - L'action effectuée (doit correspondre à l'enum du modèle Log).
 * @param {object} [options={}] - Options supplémentaires.
 * @param {string} [options.cibleType] - Le type de l'entité cible.
 * @param {string} [options.cibleId] - L'ID de l'entité cible.
 * @param {string} [options.cibleDetails] - Description/nom de la cible.
 * @param {object} [options.detailsAction] - Détails supplémentaires sur l'action.
 */
const createLogEntry = async (userId, action, options = {}) => {
    try {
        if (!userId || !action) {
            console.error("Tentative de création de log sans userId ou action.");
            return;
        }

        const logData = {
            user_id: userId,
            action,
            cible_type: options.cibleType,
            cible_id: options.cibleId,
            cible_details: options.cibleDetails,
            details_action: options.detailsAction,
        };

        // Supprimer les champs undefined pour éviter les erreurs de validation si non requis
        Object.keys(logData).forEach(key => logData[key] === undefined && delete logData[key]);

        await Log.create(logData);
        // console.log(`Log créé: User ${userId}, Action ${action}`); // Pour débogage
    } catch (error) {
        console.error(`Erreur lors de la création du log pour l'action ${action}:`, error);
        // Ne pas bloquer l'opération principale si le logging échoue, mais le signaler.
    }
};

module.exports = { createLogEntry };