const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nom: String,
    prenom: String,
    email: String
}, { _id: false });

const ueSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Le nom de l'UE est requis"],
        trim: true
    },
    code: {
        type: String,
        required: [true, "Le code de l'UE est requis"],
        unique: true,
        trim: true
    },
    image: { // Chemin vers l'image de l'UE
        type: String
    },
    description: {
        type: String,
        required: [true, "La description est requise"]
    },
    enseignants: [participantSchema], // Utilise le même schéma que participants pour la structure
    participants: [participantSchema]
}, {
    timestamps: true
});

const UE = mongoose.model('UE', ueSchema); // Nom du modèle est 'UE'
module.exports = UE;