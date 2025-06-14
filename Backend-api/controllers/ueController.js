const UE = require('../models/Ue'); // Importer le modèle UE
const User = require('../models/User'); // Importer le modèle User pour l'inscription/désinscription
const { createLogEntry } = require('../utils/logger'); 

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
// Créer un log de consultation
            await createLogEntry(req.user._id, 'consultation_ue', {
                cibleType: 'UE',
                cibleId: ue._id,
                cibleDetails: `UE: ${ue.nom} (${ue.code})`
            });
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
    const { nom, code, description } = req.body;
    let image = null;

    if (req.file) {
        image = req.file.filename; // ou req.file.path selon ce que tu veux stocker
    }

    try {
        if (!nom || !code || !description) {
            return res.status(400).json({ message: 'Veuillez fournir un nom, un code et une description pour l_UE.' });
        }
        
        const ueExists = await UE.findOne({ code });
        if (ueExists) {
            return res.status(400).json({ message: `Une UE avec le code ${code} existe déjà.` });
        }

        const newUe = new UE({
            nom,
            code,
            description,
            image, // image venant du fichier uploadé
            enseignants: [],
            participants: []
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

         // Créer un log
        await createLogEntry(req.user._id, 'creation_ue', {
            cibleType: 'UE',
            cibleId: createdUe._id,
            cibleDetails: `UE: ${createdUe.nom} (${createdUe.code})`
        });
        
        res.status(201).json(createdUe);

    } catch (error) {
        console.error('Erreur createUe:', error);
        // ... (ton code d'erreur ici)
    }
};


const updateUe = async (req, res) => {
    try {
        const ue = await UE.findById(req.params.id);
        if (!ue) return res.status(404).json({ message: 'UE non trouvée.' });

        const { nom, code, description } = req.body;
        let image = ue.image;

        if (req.file) {
            image = req.file.filename; // nouveau fichier uploadé
            // supprimer l'ancienne image du serveur
        }


        ue.nom = nom || ue.nom;
        ue.code = code || ue.code;
        ue.description = description || ue.description;
        ue.image = image;

        const updatedUe = await ue.save();

         await createLogEntry(req.user._id, 'modification_ue', { 
            cibleType: 'UE',
            cibleId: updatedUe._id,
            cibleDetails: `UE: ${updatedUe.nom} (${updatedUe.code})`,
            detailsAction: { previousDetails: oldDetails, updatedFields: Object.keys(req.body) } // Exemple de détails supplémentaires
        });

        res.status(200).json(updatedUe);
    } catch (error) {
        // gestion erreurs comme avant
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

        await ue.deleteOne(); // ou ue.remove() pour anciennes versions Mongoose
        
        await createLogEntry(req.user._id, 'suppression_ue', { 
            cibleType: 'UE',
            cibleId: req.params.id, // L'ID de l'UE supprimée
            cibleDetails: ueDetailsForLog
        });

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

        await createLogEntry(req.user._id, 'inscription_ue', { 
            cibleType: 'UE',
            cibleId: ue._id,
            cibleDetails: `Inscription à l'UE: ${ue.nom}`,
            detailsAction: { etudiantInscrit: { id: user._id, nom: user.nom, prenom: user.prenom } }
        });

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

        await createLogEntry(req.user._id, 'desinscription_ue', { 
            cibleType: 'UE',
            cibleId: ue._id,
            cibleDetails: `Désinscription de l'UE: ${ue.nom}`,
            detailsAction: { etudiantDesinscrit: { id: user._id, nom: user.nom, prenom: user.prenom } }
        });
            
        res.status(200).json({ message: "Désinscription de l'UE réussie." });

    } catch (error) {
        console.error("Erreur lors de la désinscription de l'UE:", error);
        res.status(500).json({ message: "Erreur serveur lors de la désinscription de l'UE." });
    }
};

module.exports = {
  getAllUes,      
  getUeById,       
  createUe,        
  updateUe,        
  deleteUe,              
  enrollUe,
  unenrollUe
};