const UE = require('../models/Ue');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/ues'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = file.fieldname + '-' + Date.now() + ext;
        cb(null, name);
    }
});
const upload = multer({ storage });


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




// TODO: Ajouter des fonctions pour gérer les enseignants d'une UE (ajouter/retirer un prof)
// TODO: Ajouter des fonctions pour gérer les participants d'une UE (utile pour un admin/prof pour inscrire manuellement)


module.exports = {
  getAllUes,      
  getUeById,       
  createUe,        
  updateUe,        
  deleteUe,              
};