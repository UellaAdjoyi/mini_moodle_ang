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
    
  } catch (error) {
    console.error('Erreur getPostsByUe:', error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des posts." });
  }
};

// Mettre à jour un post
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post introuvable" });

        const fields = ['titre', 'libelle'];

        fields.forEach(field => {
            if (req.body[field]) post[field] = req.body[field];
        });

        if (req.file) {
            post.fichiers_attaches = {
                path: req.file.path,
                nom_original: req.file.originalname,
                type_mime: req.file.mimetype,
                taille: req.file.size
            };
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err });
    }
};

//deposer un devoir
const addDevoir = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post introuvable" });

    // Créer le devoir à ajouter
    const nouveauDevoir = {
      user_id: req.body.user_id,
      email: req.body.email,
      date_rendu: new Date(),
      etat: 'rendu',
      note: 0,
      commentaire_prof: '',
      fichiers: []
    };
    console.log('Nouveau devoir créé :', nouveauDevoir)

    // Si un fichier a été uploadé
    if (req.file) {
      nouveauDevoir.fichiers = [{
        path: req.file.path,
        nom_original: req.file.originalname,
        type_mime: req.file.mimetype,
        taille: req.file.size
      }];
    }
    // Ajouter le devoir dans le tableau
    post.devoirs_remis.push(nouveauDevoir);
    // Sauvegarder le post
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

// corriger un devoir note + commentaire

const corriger = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post introuvable" });

    const devoir = post.devoirs_remis.id(req.params.devoirId);
    if (!devoir) return res.status(404).json({ message: "Devoir introuvable" });

    devoir.etat = 'corrigé';
    devoir.note = req.body.note;
    devoir.commentaire_prof = req.body.commentaire;

    console.log('Correction appliquée:', devoir);
    // Sauvegarder le post
    await post.save();

    res.json({ message: "Devoir corrigé avec succès", devoir });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

//   Supprimer un post

const deletePost = async (req, res) => {
    const { postId } = req.params;  // <--- ici

    try {
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        res.status(200).json({ message: "Post supprimé avec succès", post: deletedPost });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur serveur", error });
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
    getAllPosts,
    addDevoir,
    corriger,
};