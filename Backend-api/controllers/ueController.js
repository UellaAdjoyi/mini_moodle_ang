const UE = require('../models/Ue');
const fs = require('fs');
const path = require('path');

const getAllUes = async (req, res) => {
    try {
        const ues = await UE.find({});
        res.status(200).json(ues);
    } catch (error) {
        console.error('Erreur getAllUes:', error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des UEs." });
    }
};

const getUeById = async (req, res) => {
    try {
        const ue = await UE.findById(req.params.id)
            .populate('enseignants.user_id', 'nom prenom email photo')
            .populate('participants.user_id', 'nom prenom email photo');
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

const createUe = async (req, res) => {
    const { nom, code, description } = req.body;
    let image = null;

    if (req.file) {
        console.log('Image reçue :', req.file);
        image = req.file.filename;
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
            image,
            enseignants: [],
            participants: []
        });

        const createdUe = await newUe.save();
        res.status(201).json(createdUe);

    } catch (error) {
        console.error('Erreur createUe:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la création de l\'UE.' });
    }
};

const updateUe = async (req, res) => {
    try {
        const ue = await UE.findById(req.params.id);
        if (!ue) return res.status(404).json({ message: 'UE non trouvée.' });

        const { nom, code, description } = req.body;
        let image = ue.image;

        if (req.file) {
            if (ue.image) {
                const oldImagePath = path.join(__dirname, '../uploads/ues/', ue.image);
                fs.access(oldImagePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(oldImagePath, err => {
                            if (err) console.error('Erreur suppression ancienne image :', err);
                        });
                    }
                });
            }
            image = req.file.filename;
        }


        ue.nom = nom || ue.nom;
        ue.code = code || ue.code;
        ue.description = description || ue.description;
        ue.image = image;

        const updatedUe = await ue.save();
        res.status(200).json(updatedUe);
    } catch (error) {
        console.error('Erreur updateUe:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'UE.' });
    }
};

const deleteUe = async (req, res) => {
    try {
        const ue = await UE.findById(req.params.id);
        if (!ue) {
            return res.status(404).json({ message: 'UE non trouvée.' });
        }

        // Supprimer image associée si elle existe
        if (ue.image) {
            const imagePath = path.join(__dirname, '../uploads/ues/', ue.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Erreur suppression image lors du delete :', err);
            });
        }

        await ue.deleteOne();
        res.status(200).json({ message: 'UE supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur deleteUe:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'UE non trouvée (ID mal formé).' });
        }
        res.status(500).json({ message: "Erreur serveur lors de la suppression de l'UE." });
    }
};



module.exports = {
    getAllUes,
    getUeById,
    createUe,
    updateUe,
    deleteUe,
};
