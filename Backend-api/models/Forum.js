const mongoose = require('mongoose');

const auteurMessageSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nom: String,
    prenom: String,
    email: String // Optionnel, peut être populé
}, { _id: false });

const messageSchema = new mongoose.Schema({
    // message_id sera généré automatiquement par MongoDB comme _id pour ce sous-document
    auteur: { type: auteurMessageSchema, required: true },
    contenu: { type: String, required: true },
    date_heure: { type: Date, default: Date.now },
    // On pourrait ajouter des réponses imbriquées ici si nécessaire
});

const forumSchema = new mongoose.Schema({
    ue_id: { // Référence à l'UE à laquelle ce forum appartient
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UE',
        required: true
    },
    // nomUE et codeUE peuvent être populés depuis ue_id
    nomUE: { type: String, required: true },
    codeUE: { type: String, required: true },
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    messages: [messageSchema],
    date_creation: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Forum = mongoose.model('Forum', forumSchema);
module.exports = Forum;