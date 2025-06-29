const Forum = require('../models/Forum');
const UE = require('../models/Ue');
const User = require('../models/User');

exports.createForum = async (req, res) => {
    try {
        const { ue_id, titre, description } = req.body;

        // Récupérer l'UE pour stocker nomUE et codeUE
        const ue = await UE.findById(ue_id);
        if (!ue) {
            return res.status(404).json({ message: "UE non trouvée" });
        }

        const newForum = new Forum({
            ue_id: ue._id,
            nomUE: ue.nom,
            codeUE: ue.code,
            titre,
            description
        });

        const savedForum = await newForum.save();
        res.status(201).json(savedForum);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de la création du forum" });
    }
};

exports.getForumsByUE = async (req, res) => {
    try {
        const { ue_id } = req.params;
        const forums = await Forum.find({ ue_id });
        res.json(forums);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getForumById = async (req, res) => {
    try {
        const forum = await Forum.findById(req.params.id);
        if (!forum) return res.status(404).json({ message: "Forum non trouvé" });
        res.json(forum);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.addMessageToForum = async (req, res) => {
    try {
        const { contenu, auteur } = req.body; // auteur = {user_id, nom, prenom, email}
        const forum = await Forum.findById(req.params.id);
        if (!forum) return res.status(404).json({ message: "Forum non trouvé" });

        forum.messages.push({
            contenu,
            auteur
        });

        await forum.save();
        res.status(201).json(forum);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de l'ajout du message" });
    }
};
