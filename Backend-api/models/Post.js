const mongoose = require('mongoose');

const auteurSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nom: String,
    prenom: String,
    email: String
}, { _id: false });

const fichierSchema = new mongoose.Schema({
    path: { type: String, required: true }, // Chemin de stockage ou URL
    nom_original: { type: String, required: true },
    type_mime: { type: String }, // e.g., 'application/pdf', 'image/jpeg'
    taille: { type: Number } // en bytes
}, { _id: false });


const devoirRemisSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nom: String,
    prenom: String,
    email: String,
    fichiers: [fichierSchema], // Un étudiant peut remettre plusieurs fichiers pour un devoir
    date_rendu: { type: Date, default: Date.now },
    etat: {
        type: String,
        enum: ['en attente', 'en retard', 'rendu', 'corrigé'],
        default: 'en attente'
    },
    note: { type: String }, // Ou Number, selon si vous voulez des notes comme "15/20" ou juste 15
    commentaire_prof: { type: String } // Renommé pour clarté
});

const postSchema = new mongoose.Schema({
    
    codeUE: { type: String, required: true },
    type_post: {
        type: String,
        required: true,
        enum: ['devoir', 'message', 'fichier'] // 'annonce' pourrait être utile
    },
    titre: {
        type: String,
        required: true
    },
    libelle: { // Contenu principal du post
        type: String,
        required: true
    },
    date_heure_publication: { // Renommé pour clarté
        type: Date,
        default: Date.now
    },
    date_limite: { // Spécifique aux devoirs
        type: Date
    },
    fichiers_attaches: [fichierSchema], // Fichiers attachés au post (par ex. sujet du devoir)

    devoirs_remis: [devoirRemisSchema] // Pour les posts de type 'devoir'
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;