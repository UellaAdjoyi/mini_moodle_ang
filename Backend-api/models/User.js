const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const enrolledCourseSchema = new mongoose.Schema({
    ue_id: { // Fera référence à l'ID d'une UE
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UE', // Nom du modèle UE qu'on va créer
        required: true
    },
    nom: { // Nom de l'UE, peut-être redondant si on populate, mais utile pour affichage rapide
        type: String,
        required: true
    },
    dernierAcces: {
        type: Date
    }
}, { _id: false }); // Pas besoin d'un _id séparé pour ce sous-document si ue_id est unique dans le tableau

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Le nom est requis"]
    },
    prenom: {
        type: String,
        required: [true, "Le prénom est requis"]
    },
    role: {
        type: [String],
        enum: ['ROLE_ETUDIANT', 'ROLE_PROF', 'ROLE_ADMIN'],
        required: true
    }
,
    email: {
        type: String,
        required: [true, "L'email est requis"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Veuillez entrer un email valide']
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis"],
        minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"]
    },
    photo: {
        type: String // Chemin vers la photo
    },
    serviceProf: { // Spécifique aux professeurs
        type: String
    },
    bureauProf: { // Spécifique aux professeurs
        type: String
    },
    cours: [enrolledCourseSchema] // Tableau des cours auxquels l'utilisateur est inscrit/enseigne
}, {
    timestamps: true // Ajoute createdAt et updatedAt
});

// Middleware pour hasher le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Méthode pour comparer le mot de passe
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
