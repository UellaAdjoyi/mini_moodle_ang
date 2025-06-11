const UE = require('../models/Ue'); // Importer le modèle UE
const User = require('../models/User'); // Importer le modèle User pour l'inscription/désinscription

// @desc    Récupérer toutes les UEs
// @route   GET /api/ues
// @access  Private (ou Public selon vos règles, ici on le met protégé)
const getAllUes = async (req, res) => {
    try {
        const ues = await UE.find({})
            // Optionnel: populer des informations de base sur les enseignants si nécessaire pour la liste
            // .populate('enseignants.user_id', 'nom prenom');
        res.status(200).json(ues);
    } catch (error) {
        console.error('Erreur getAllUes:', error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des UEs." });
    }
};

// @desc    Récupérer une UE par son ID
// @route   GET /api/ues/:id
// @access  Private (ou Public)
const getUeById = async (req, res) => {
    try {
        const ue = await UE.findById(req.params.id)
            .populate('enseignants.user_id', 'nom prenom email photo') // Populer les infos des enseignants
            .populate('participants.user_id', 'nom prenom email photo'); // Populer les infos des participants
            
        if (ue) {
            res.status(200).json(ue);
        } else {
            res.status(404).json({ message: 'UE non trouvée.' });
        }
    } catch (error) {
        console.error('Erreur getUeById:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'UE non trouvée (ID mal formé).' });
        }
        res.status(500).json({ message: "Erreur serveur lors de la récupération de l'UE." });
    }
};

// @desc    Créer une nouvelle UE
// @route   POST /api/ues
// @access  Private (ex: 'prof' ou 'admin')
const createUe = async (req, res) => {
    const { nom, code, description, image } = req.body; // `enseignants` sera géré par l'utilisateur créateur

    // Vérification du rôle de l'utilisateur (exemple)
    if (req.user.role !== 'prof' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé pour créer une UE.' });
    }

    try {
        if (!nom || !code || !description) {
            return res.status(400).json({ message: 'Veuillez fournir un nom, un code et une description pour l_UE.' });
        }

        const ueExists = await UE.findOne({ code });
        if (ueExists) {
            return res.status(400).json({ message: `Une UE avec le code ${code} existe déjà.` });
        }

        // Ajouter l'utilisateur créateur comme premier enseignant
        const creatorAsTeacher = {
            user_id: req.user._id,
            nom: req.user.nom,
            prenom: req.user.prenom,
            email: req.user.email
        };

        const newUe = new UE({
            nom,
            code,
            description,
            image: image || null,
            enseignants: [creatorAsTeacher], // L'utilisateur connecté (prof/admin) est le premier enseignant
            participants: [] // Vide à la création
        });

        const createdUe = await newUe.save();

        // Optionnel : Ajouter cette UE aux `cours` de l'utilisateur créateur s'il est prof
        if (req.user.role === 'prof') {
            const user = await User.findById(req.user._id);
            if (user) {
                const isUeAlreadyInProfile = user.cours.some(c => c.ue_id.toString() === createdUe._id.toString());
                if (!isUeAlreadyInProfile) {
                    user.cours.push({
                        ue_id: createdUe._id,
                        nom: createdUe.nom,
                        // dernierAcces peut être mis à jour plus tard
                    });
                    await user.save();
                }
            }
        }
        
        res.status(201).json(createdUe);

    } catch (error) {
        console.error('Erreur createUe:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: "Erreur serveur lors de la création de l'UE." });
    }
};

// @desc    Mettre à jour une UE
// @route   PUT /api/ues/:id
// @access  Private (ex: 'prof' enseignant de l'UE ou 'admin')
const updateUe = async (req, res) => {
    try {
        const ue = await UE.findById(req.params.id);

        if (!ue) {
            return res.status(404).json({ message: 'UE non trouvée.' });
        }

        // Vérification des droits : l'utilisateur est-il enseignant de cette UE ou admin ?
        const isTeacherOfUe = ue.enseignants.some(e => e.user_id.toString() === req.user._id.toString());
        if (!isTeacherOfUe && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé pour modifier cette UE.' });
        }

        const { nom, code, description, image } = req.body;

        // Si le code est modifié, vérifier qu'il ne rentre pas en conflit avec une autre UE
        if (code && code !== ue.code) {
            const ueWithNewCodeExists = await UE.findOne({ code });
            if (ueWithNewCodeExists) {
                return res.status(400).json({ message: `Une autre UE avec le code ${code} existe déjà.` });
            }
        }
        
        ue.nom = nom || ue.nom;
        ue.code = code || ue.code;
        ue.description = description || ue.description;
        ue.image = image !== undefined ? image : ue.image; // Permet de mettre à null ou vide si image: "" ou image: null
        // La gestion des listes `enseignants` et `participants` se fera via des routes dédiées pour plus de granularité
        // (ex: /api/ues/:id/teachers, /api/ues/:id/participants) ou ici si on envoie le tableau complet.
        // Pour l'instant, on ne modifie que les champs simples.

        const updatedUe = await ue.save();
        res.status(200).json(updatedUe);

    } catch (error) {
        console.error('Erreur updateUe:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'UE non trouvée (ID mal formé).' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'UE." });
    }
};

// @desc    Supprimer une UE
// @route   DELETE /api/ues/:id
// @access  Private (ex: 'admin' ou prof créateur/principal)
const deleteUe = async (req, res) => {
    try {
        const ue = await UE.findById(req.params.id);

        if (!ue) {
            return res.status(404).json({ message: 'UE non trouvée.' });
        }

        // Vérification des droits (plus stricte pour la suppression)
        // Par exemple, seul un admin peut supprimer, ou le premier enseignant listé.
        const isCreatorOrAdmin = (ue.enseignants.length > 0 && ue.enseignants[0].user_id.toString() === req.user._id.toString()) || req.user.role === 'admin';
        if (!isCreatorOrAdmin) {
            return res.status(403).json({ message: 'Accès non autorisé pour supprimer cette UE.' });
        }

        // Avant de supprimer l'UE, il faudrait gérer la désinscription des utilisateurs
        // et la suppression/archivage des posts, forums, etc., liés à cette UE.
        // C'est une opération complexe qui peut nécessiter des transactions ou plusieurs étapes.
        // Pour l'instant, on supprime juste l'UE.

        // Retirer l'UE des listes `cours` de tous les utilisateurs (enseignants et participants)
        await User.updateMany(
            { 'cours.ue_id': ue._id },
            { $pull: { cours: { ue_id: ue._id } } }
        );

        // TODO: Supprimer les Posts, Forums, Logs liés à cette UE

        await ue.deleteOne(); // ou ue.remove() pour anciennes versions Mongoose
        
        res.status(200).json({ message: 'UE supprimée avec succès.' });

    } catch (error) {
        console.error('Erreur deleteUe:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'UE non trouvée (ID mal formé).' });
        }
        res.status(500).json({ message: "Erreur serveur lors de la suppression de l'UE." });
    }
};


// @desc    Inscrire l'utilisateur authentifié à une UE
// @route   POST /api/ues/:id/enroll
// @access  Private (pour les 'etu')
const enrollUe = async (req, res) => {
    try {
        if (req.user.role !== 'etu') { // Seuls les étudiants peuvent s'inscrire via cette route
            return res.status(403).json({ message: "Seuls les étudiants peuvent s'inscrire aux UEs."});
        }

        const ue = await UE.findById(req.params.id);
        const user = await User.findById(req.user._id); // Utilisateur authentifié

        if (!ue || !user) {
            return res.status(404).json({ message: "UE ou utilisateur non trouvé." });
        }

        // Vérifier si l'utilisateur est déjà inscrit dans l'UE (liste des participants de l'UE)
        const isAlreadyParticipant = ue.participants.some(p => p.user_id.toString() === user._id.toString());
        if (isAlreadyParticipant) {
            return res.status(400).json({ message: "Vous êtes déjà inscrit à cette UE." });
        }
        
        // Vérifier si l'UE est déjà dans la liste `cours` de l'utilisateur (double sécurité)
        const isUeInUserCourses = user.cours.some(c => c.ue_id.toString() === ue._id.toString());
        if (isUeInUserCourses) {
             return res.status(400).json({ message: "Cette UE est déjà dans votre liste de cours." });
        }

        // Ajouter l'étudiant aux participants de l'UE
        ue.participants.push({
            user_id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email
        });

        // Ajouter l'UE à la liste `cours` de l'étudiant
        user.cours.push({
            ue_id: ue._id,
            nom: ue.nom,
            dernierAcces: new Date() // Mettre à jour le dernier accès
        });

        await ue.save();
        await user.save();

        res.status(200).json({ message: "Inscription à l'UE réussie.", ue: ue, userCourses: user.cours });

    } catch (error) {
        console.error("Erreur lors de l'inscription à l'UE:", error);
        res.status(500).json({ message: "Erreur serveur lors de l'inscription à l'UE." });
    }
};
    
// @desc    Désinscrire l'utilisateur authentifié d'une UE
// @route   POST /api/ues/:id/unenroll
// @access  Private (pour les 'etu')
const unenrollUe = async (req, res) => {
     try {
        if (req.user.role !== 'etu') {
            return res.status(403).json({ message: "Seuls les étudiants peuvent se désinscrire des UEs."});
        }

        const ue = await UE.findById(req.params.id);
        const user = await User.findById(req.user._id);

        if (!ue || !user) {
            return res.status(404).json({ message: "UE ou utilisateur non trouvé." });
        }

        // Vérifier si l'utilisateur est bien participant
        const isParticipant = ue.participants.some(p => p.user_id.toString() === user._id.toString());
        if (!isParticipant) {
            return res.status(400).json({ message: "Vous n'êtes pas inscrit à cette UE." });
        }

        // Retirer l'étudiant des participants de l'UE
        ue.participants = ue.participants.filter(p => p.user_id.toString() !== user._id.toString());
        // Retirer l'UE de la liste `cours` de l'étudiant
        user.cours = user.cours.filter(c => c.ue_id.toString() !== ue._id.toString());

        await ue.save();
        await user.save();
            
        res.status(200).json({ message: "Désinscription de l'UE réussie." });

    } catch (error) {
        console.error("Erreur lors de la désinscription de l'UE:", error);
        res.status(500).json({ message: "Erreur serveur lors de la désinscription de l'UE." });
    }
};

// TODO: Ajouter des fonctions pour gérer les enseignants d'une UE (ajouter/retirer un prof)
// TODO: Ajouter des fonctions pour gérer les participants d'une UE (utile pour un admin/prof pour inscrire manuellement)


module.exports = {
  getAllUes,      
  getUeById,       
  createUe,        
  updateUe,        
  deleteUe,        
  enrollUe,        
  unenrollUe,      
};