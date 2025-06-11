const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [ // Liste plus exhaustive pour les actions possibles
            'connexion', 'deconnexion',
            'consultation_ue', 'inscription_ue', 'desinscription_ue',
            'creation_post', 'consultation_post', 'modification_post', 'suppression_post',
            'depot_devoir', 'consultation_devoir_remis', 'notation_devoir',
            'creation_message_forum', 'consultation_forum',
            'modification_profil',
            // Ajoutez d'autres actions spécifiques
        ]
    },
    cible_type: { // Type de la cible (ex: 'UE', 'Post', 'User')
        type: String
    },
    cible_id: { // ID de la cible (ex: _id de l'UE, _id du Post)
        type: mongoose.Schema.Types.ObjectId
        // refPath: 'cible_type' // Permet une référence dynamique si cible_type correspond à un nom de modèle
    },
    cible_details: { // Pour stocker des détails supplémentaires sur la cible, comme le nom de l'UE
        type: String
    },
    details_action: { // Pour des informations supplémentaires sur l'action elle-même
        type: mongoose.Schema.Types.Mixed // Peut stocker n'importe quel JSON
    },
    date_heure: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'date_heure', updatedAt: false } // Utiliser date_heure comme createdAt
});

// Pour permettre de référencer dynamiquement la cible si besoin
// logSchema.path('cible_id').ref(function() {
//   return this.cible_type; // Assurez-vous que cible_type est un nom de modèle valide
// });


const Log = mongoose.model('Log', logSchema);
module.exports = Log;