const Post = require('../models/Post');
const UE = require('../models/Ue');

// @desc    Créer un nouveau post dans une UE
// @route   POST /api/ues/:ueId/posts
// @access  Private (enseignant de l'UE ou admin)
const createPostInUe = async (req, res) => {
    const { ueId } = req.params;
    const { type_post, titre, libelle, commentaires_post, date_limite, fichiers_attaches } = req.body;

    try {
        const ue = await UE.findById(ueId);
        if (!ue) {
            return res.status(404).json({ message: "UE non trouvée." });
        }

        // Vérification des droits : l'utilisateur est-il enseignant de cette UE ou admin ?
        const isTeacherOfUe = ue.enseignants.some(e => e.user_id.toString() === req.user._id.toString());
        if (!isTeacherOfUe && req.user.role !== 'admin') {
             return res.status(403).json({ message: "Accès non autorisé pour créer un post dans cette UE."});
        }

        if (!type_post || !titre || !libelle) {
            return res.status(400).json({ message: "Veuillez fournir type, titre et libellé pour le post." });
        }
        if (type_post === 'devoir' && !date_limite) {
            return res.status(400).json({ message: "Veuillez fournir une date limite pour un post de type 'devoir'." });
        }

        const auteurInfo = {
            user_id: req.user._id,
            nom: req.user.nom,
            prenom: req.user.prenom,
            email: req.user.email // Optionnel, peut être populé plus tard
        };

        const newPost = await Post.create({
            ue_id: ueId,
            nomUE: ue.nom,       // Dénormalisation
            codeUE: ue.code,     // Dénormalisation
            type_post,
            titre,
            libelle,
            commentaires_post,
            date_limite: type_post === 'devoir' ? date_limite : null,
            fichiers_attaches: fichiers_attaches || [], // Assurer que c'est un tableau
            auteur: auteurInfo,
            devoirs_remis: [] // Initialement vide pour un nouveau post
        });

        res.status(201).json(newPost);

    } catch (error) {
        console.error('Erreur createPostInUe:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: "Erreur serveur lors de la création du post." });
    }
};

//créer un post (message)
const createPost = async (req, res) => {
  const { codeUE, titre, type_post, libelle, date_limit } = req.body;
  let fichiers_attaches = null;

  if (req.file) {
    fichiers_attaches = {
      path: req.file.path,
      nom_original: req.file.originalname,
      type_mime: req.file.mimetype,
      taille: req.file.size
    };
  }

  try {
    if (!codeUE || !titre || !libelle) {
      return res.status(400).json({ message: 'Veuillez fournir un titre, un code et un libellé.' });
    }

    const date_heure_publication = new Date();

    const postData = {
      titre,
      libelle,
      codeUE,
      type_post,
      date_heure_publication
    };

    if (type_post === 'fichier') {
      postData.fichiers_attaches = [fichiers_attaches];
    }

    if (type_post === 'devoir') {
      postData.devoirs_remis = [];
      postData.date_limite = date_limit;
    }

    const newPost = new Post(postData);
    const createdPost = await newPost.save();

    res.status(201).json(createdPost);

  } catch (error) {
    console.error('Erreur createPost:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du post.' });
  }
};


// create posts (fichier)
const createFilePost = async (req, res) => {
  const { codeUE, titre, type_post, libelle, date_limit } = req.body;
  let fichiers_attaches = null;
  if (req.file) {
    fichiers_attaches = {
      path: req.file.path,
      nom_original: req.file.originalname,
      type_mime: req.file.mimetype,
      taille: req.file.size
    };
  }

  try {
    if (!codeUE || !titre || !libelle) {
      return res.status(400).json({ message: 'Veuillez fournir un titre, un code et un libellé.' });
    }

    const date_heure_publication = new Date();

    const postData = {
      titre,
      libelle,
      codeUE,
      type_post,
      date_heure_publication
    };

    if (type_post === 'fichier') {
      postData.fichiers_attaches = [fichiers_attaches];
    }

    if (type_post === 'devoir') {
      postData.devoirs_remis = [];
      postData.date_limite = date_limit;
    }

    const newPost = new Post(postData);
    const createdPost = await newPost.save();

    res.status(201).json(createdPost);

  } catch (error) {
    console.error('Erreur createPost:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du post.' });
  }
};

//recupere tous les posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    console.error('Erreur getAllPosts:', error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des posts." });
  }
};


//   Récupérer tous les posts d'une UE
const getPostsByUe = async (req, res) => {
  const { codeUe } = req.params;
  try {
    const posts = await Post.find({ codeUE: codeUe })
      .sort({ date_heure_publication: -1 });
    res.status(200).json(posts);
    console.log(posts)
  } catch (error) {
    console.error('Erreur getPostsByUe:', error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des posts." });
  }
};


// @desc    Récupérer un post spécifique par son ID
// @route   GET /api/posts/:postId  (Note: route non imbriquée sous /ues pour plus de flexibilité, ou /api/ues/:ueId/posts/:postId)
// @access  Private (membre de l'UE du post ou admin)
const getPostById = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId)
            .populate('auteur.user_id', 'nom prenom photo')
            .populate('ue_id', 'nom code'); // Populer l'UE pour le contexte

        if (!post) {
            return res.status(404).json({ message: "Post non trouvé." });
        }

        // Récupérer l'UE parente pour vérifier les droits d'accès
        const ue = await UE.findById(post.ue_id._id); // post.ue_id est déjà populé, donc post.ue_id._id est l'ID
        if (!ue) {
             return res.status(404).json({ message: "UE parente du post non trouvée. Données potentiellement corrompues." });
        }

        const isParticipant = ue.participants.some(p => p.user_id.toString() === req.user._id.toString());
        const isTeacher = ue.enseignants.some(e => e.user_id.toString() === req.user._id.toString());

        if (!isParticipant && !isTeacher && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès non autorisé pour voir ce post."});
        }
        
        // Si le post est un devoir, on pourrait vouloir populer les devoirs_remis avec les infos de l'étudiant
        // if (post.type_post === 'devoir') {
        //    await post.populate('devoirs_remis.user_id', 'nom prenom email').execPopulate(); // Mongoose 5
        //    await post.populate({ path: 'devoirs_remis.user_id', select: 'nom prenom email' }); // Mongoose 6+
        // }


        res.status(200).json(post);

    } catch (error) {
        console.error('Erreur getPostById:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Post non trouvé (ID mal formé).' });
        }
        res.status(500).json({ message: "Erreur serveur lors de la récupération du post." });
    }
};


// @desc    Mettre à jour un post
// @route   PUT /api/posts/:postId
// @access  Private (auteur du post ou admin/enseignant de l'UE)
const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { titre, libelle, commentaires_post, date_limite, fichiers_attaches, type_post } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé." });
        }

        // Vérification des droits : l'utilisateur est-il l'auteur du post OU un enseignant de l'UE OU un admin ?
        const ue = await UE.findById(post.ue_id); // ue_id est un ObjectId ici, pas un document
        if (!ue) {
            return res.status(404).json({ message: "UE parente du post non trouvée." });
        }
        const isTeacherOfUe = ue.enseignants.some(e => e.user_id.toString() === req.user._id.toString());
        const isAuthor = post.auteur.user_id.toString() === req.user._id.toString();

        if (!isAuthor && !isTeacherOfUe && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès non autorisé pour modifier ce post." });
        }

        // On ne permet pas de changer le type_post, l'auteur, ou l'UE parente facilement ici.
        // Ces opérations seraient plus complexes.
        post.titre = titre || post.titre;
        post.libelle = libelle || post.libelle;
        post.commentaires_post = commentaires_post !== undefined ? commentaires_post : post.commentaires_post;
        if (post.type_post === 'devoir') {
            post.date_limite = date_limite || post.date_limite;
        }
        if (fichiers_attaches !== undefined) { // Permet de vider la liste si un tableau vide est envoyé
            post.fichiers_attaches = fichiers_attaches;
        }
        // Mise à jour de la date de modification via les timestamps de Mongoose

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);

    } catch (error) {
        console.error('Erreur updatePost:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Post non trouvé (ID mal formé).' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour du post." });
    }
};

// @desc    Supprimer un post
// @route   DELETE /api/posts/:postId
// @access  Private (auteur du post ou admin/enseignant de l'UE)
const deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé." });
        }

        // Vérification des droits similaire à updatePost
        const ue = await UE.findById(post.ue_id);
        if (!ue) {
            return res.status(404).json({ message: "UE parente du post non trouvée." });
        }
        const isTeacherOfUe = ue.enseignants.some(e => e.user_id.toString() === req.user._id.toString());
        const isAuthor = post.auteur.user_id.toString() === req.user._id.toString();

        if (!isAuthor && !isTeacherOfUe && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès non autorisé pour supprimer ce post." });
        }

        // TODO: Gérer la suppression des fichiers attachés du stockage si nécessaire.
        // TODO: Gérer la suppression des devoirs remis liés si nécessaire.

        await post.deleteOne();
        res.status(200).json({ message: "Post supprimé avec succès." });

    } catch (error) {
        console.error('Erreur deletePost:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Post non trouvé (ID mal formé).' });
        }
        res.status(500).json({ message: "Erreur serveur lors de la suppression du post." });
    }
};


// Fonctions pour la gestion des devoirs remis (à venir)
// POST /api/posts/:postId/submit (pour un étudiant)
// GET /api/posts/:postId/submissions (pour un enseignant/admin)
// PUT /api/posts/:postId/submissions/:submissionId/grade (pour un enseignant)

module.exports = {
    createPostInUe,
    getPostsByUe,
    getPostById,
    updatePost,
    deletePost,
    createPost,
    createFilePost,
    getAllPosts
};