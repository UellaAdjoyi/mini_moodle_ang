const Post = require('../models/Post');
const UE = require('../models/Ue');
const Log = require('../models/Log');
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
      const log = new Log({
          user_id: req.user._id,
          action: 'creation_post',
          cible_type: 'Post',
          cible_id: createdPost._id,
          cible_details: titre
      });
      await log.save();

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
      const log = new Log({
          user_id: req.user._id,
          action: 'creation_post',
          cible_type: 'Post',
          cible_id: createdPost._id,
          cible_details: titre
      });
      await log.save();
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
        const log = new Log({
            user_id: req.user._id,
            action: 'modification_post',
            cible_type: 'Post',
            cible_id: post._id,
            cible_details: post.titre
        });
        await log.save();

        res.json(post);
    } catch (err) {
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

        const log = new Log({
            user_id: req.user._id,
            action: 'suppression_post',
            cible_type: 'Post',
            cible_id: deletedPost._id,
            cible_details: deletedPost.titre
        });
        await log.save();

        res.status(200).json({ message: "Post supprimé avec succès", post: deletedPost });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};


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

        res.status(200).json(post);

    } catch (error) {
        console.error('Erreur getPostById:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Post non trouvé (ID mal formé).' });
        }
        res.status(500).json({ message: "Erreur serveur lors de la récupération du post." });
    }
};



module.exports = {
    getPostsByUe,
    getPostById,
    updatePost,
    deletePost,
    createPost,
    createFilePost,
    getAllPosts
};