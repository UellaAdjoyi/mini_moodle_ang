const Forum = require('../models/Forum');
const UE = require('../models/Ue');
const User = require('../models/User'); // Pour les auteurs de messages

// @desc    Créer ou récupérer le forum d'une UE. Si un seul forum par UE est souhaité.
//          Alternative: juste créer, et avoir une route GET séparée.
//          Ici, on va opter pour "créer s'il n'existe pas, sinon le retourner".
//          Ou plus simplement : créer un forum. Une UE ne devrait avoir qu'un forum principal.
// @route   POST /api/ues/:ueId/forum
// @access  Private (enseignant de l'UE ou admin)
const createForumForUe = async (req, res) => {
    const { ueId } = req.params;
    const { titre, description } = req.body; // Titre et description du forum

    try {
        const ue = await UE.findById(ueId);
        if (!ue) {
            return res.status(404).json({ message: "UE non trouvée." });
        }

        // Vérifier droits (enseignant de l'UE ou admin)
        const isTeacherOfUe = ue.enseignants.some(e => e.user_id.toString() === req.user._id.toString());
        if (!isTeacherOfUe && req.user.role !== 'admin') {
             return res.status(403).json({ message: "Accès non autorisé pour créer un forum pour cette UE."});
        }

        // Vérifier si un forum existe déjà pour cette UE
        let forum = await Forum.findOne({ ue_id: ueId });
        if (forum) {
            return res.status(400).json({ message: `Un forum existe déjà pour l'UE ${ue.nom}. Utilisez PUT pour le modifier ou accédez-y directement.`});
        }

        if (!titre) {
            return res.status(400).json({ message: "Veuillez fournir un titre pour le forum." });
        }

        forum = await Forum.create({
            ue_id: ueId,
            nomUE: ue.nom,
            codeUE: ue.code,
            titre,
            description: description || `Forum de discussion pour l'UE ${ue.nom}`,
            messages: []
        });

        res.status(201).json(forum);

    } catch (error) {
        console.error('Erreur createForumForUe:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: "Erreur serveur lors de la création du forum." });
    }
};

// @desc    Récupérer le forum d'une UE (en supposant un seul forum principal par UE)
// @route   GET /api/ues/:ueId/forum
// @access  Private (membre de l'UE ou admin)
const getForumByUe = async (req, res) => {
    const { ueId } = req.params;
    try {
        const ue = await UE.findById(ueId);
        if (!ue) {
            return res.status(404).json({ message: "UE non trouvée." });
        }

        // Vérifier droits d'accès à l'UE
        const isParticipant = ue.participants.some(p => p.user_id.toString() === req.user._id.toString());
        const isTeacher = ue.enseignants.some(e => e.user_id.toString() === req.user._id.toString());
        if (!isParticipant && !isTeacher && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès non autorisé pour voir le forum de cette UE."});
        }

        const forum = await Forum.findOne({ ue_id: ueId })
            .populate({ // Populer les auteurs des messages
                path: 'messages.auteur.user_id',
                select: 'nom prenom photo' // Champs à récupérer de l'utilisateur
            });
            // On pourrait vouloir paginer les messages ici pour les forums très actifs.

        if (!forum) {
            // Option: retourner 404 ou permettre de le créer à la volée s'il n'y a pas de route POST dédiée
            return res.status(404).json({ message: "Aucun forum trouvé pour cette UE. Un enseignant peut en créer un." });
        }
        res.status(200).json(forum);
    } catch (error) {
        console.error('Erreur getForumByUe:', error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération du forum." });
    }
};

// @desc    Ajouter un message à un forum
// @route   POST /api/forums/:forumId/messages
// @access  Private (membre de l'UE du forum ou admin)
const addMessageToForum = async (req, res) => {
    const { forumId } = req.params;
    const { contenu } = req.body;

    if (!contenu) {
        return res.status(400).json({ message: "Le contenu du message ne peut pas être vide." });
    }

    try {
        const forum = await Forum.findById(forumId);
        if (!forum) {
            return res.status(404).json({ message: "Forum non trouvé." });
        }

        // Vérifier que l'utilisateur a le droit de poster dans ce forum (est membre de l'UE associée)
        const ue = await UE.findById(forum.ue_id);
        if (!ue) {
            return res.status(404).json({ message: "UE associée au forum non trouvée."});
        }
        const isParticipant = ue.participants.some(p => p.user_id.toString() === req.user._id.toString());
        const isTeacher = ue.enseignants.some(e => e.user_id.toString() === req.user._id.toString());
        if (!isParticipant && !isTeacher && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès non autorisé pour poster un message dans ce forum."});
        }

        const newMessage = {
            auteur: {
                user_id: req.user._id,
                nom: req.user.nom,
                prenom: req.user.prenom,
                // email: req.user.email // Optionnel
            },
            contenu,
            date_heure: new Date() // Géré par défaut dans le schéma, mais on peut forcer ici
        };

        forum.messages.push(newMessage);
        await forum.save();

        // Pour retourner le message avec l'auteur populé directement après création
        const updatedForum = await Forum.findById(forumId).populate('messages.auteur.user_id', 'nom prenom photo');
        const postedMessage = updatedForum.messages.find(msg => msg.contenu === contenu && msg.auteur.user_id.toString() === req.user._id.toString()); // Moyen simple de retrouver le message

        res.status(201).json(postedMessage || newMessage); // Renvoyer le message ajouté

    } catch (error) {
        console.error('Erreur addMessageToForum:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: "Erreur serveur lors de l'ajout du message." });
    }
};

// @desc    Mettre à jour les informations d'un forum (titre, description)
// @route   PUT /api/forums/:forumId  (Ou /api/ues/:ueId/forum si on identifie par ueId)
// @access  Private (enseignant de l'UE du forum ou admin)
const updateForumDetails = async (req, res) => {
    const { forumId } = req.params;
    const { titre, description } = req.body;

    try {
        const forum = await Forum.findById(forumId).populate('ue_id', 'enseignants');
        if (!forum) {
            return res.status(404).json({ message: "Forum non trouvé." });
        }

        // Vérifier droits
        const isTeacherOfUe = forum.ue_id.enseignants.some(e => e.user_id.toString() === req.user._id.toString());
        if (!isTeacherOfUe && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès non autorisé pour modifier ce forum." });
        }

        if (titre) forum.titre = titre;
        if (description !== undefined) forum.description = description;

        await forum.save();
        res.status(200).json(forum);

    } catch (error) {
        console.error('Erreur updateForumDetails:', error);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour du forum." });
    }
};




module.exports = {
    createForumForUe,
    getForumByUe,
    addMessageToForum,
    updateForumDetails,
};