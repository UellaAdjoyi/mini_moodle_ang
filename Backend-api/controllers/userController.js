const User = require("../models/User");
const generatePassword = require("../utils/generatePassword");
const sendEmail = require("../utils/sendEmail");
const Ue = require("../models/Ue");

const registerUser = async (req, res) => {
  const { nom, prenom, email, role, serviceProf, bureauProf } = req.body;

  try {
    if (!nom || !prenom || !email || !role) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }

    const generatedPassword = generatePassword();
    const photo = req.file ? `/uploads/users/${req.file.filename}` : null;

    const newUser = new User({
      nom,
      prenom,
      email,
      password: generatedPassword,
      role,
      photo,
      serviceProf: role === 'ROLE_PROF' ? serviceProf : null,
      bureauProf: role === 'ROLE_PROF' ? bureauProf : null,
      cours: []
    });

    await newUser.save();

    await sendEmail(
        email,
        'Votre compte a été créé',
        `Bonjour ${prenom},\n\nVoici votre mot de passe de connexion : ${generatedPassword}\n\nMerci de le modifier dès votre première connexion.`
    );

    res.status(201).json({ message: 'Utilisateur enregistré et email envoyé.', user: newUser });
  } catch (error) {
    console.error('Erreur dans registerUser:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const fields = ['nom', 'prenom', 'email', 'password', 'date_naissance', 'service_prof', 'bureau_prof', 'dernier_acces', 'role'];

    fields.forEach(field => {
      if (req.body[field]) user[field] = req.body[field];
    });

    if (req.file) {
      user.photo = `/uploads/users/${req.file.filename}`;
    }


    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const fields = ['nom', 'prenom', 'email', 'password', 'date_naissance', 'serviceProf', 'bureauProf'];

    fields.forEach(field => {
      if (req.body[field]) user[field] = req.body[field];
    });

    if (req.file) {
      user.photo = `/uploads/users/${req.file.filename}`;
    }

    await user.save();

    res.json({
      message: "Profil mis à jour avec succès",
      user: {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        photo: user.photo,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Erreur updateProfile:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil.' });
  }
};


const getUserPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('photo');
    if (!user || !user.photo) {
      return res.status(404).json({ message: 'Photo non trouvée' });
    }

    res.set('Content-Type', 'image/png'); // ou 'image/jpeg' si tu veux
    res.send(user.photo);
  } catch (error) {
    console.error('Erreur photo utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();

    const usersWithPhotoPaths = users.map(user => {
      if (user.photo && typeof user.photo === 'string') {
        user.photo = user.photo;
      } else {
        user.photo = null;
      }
      return user;
    });

    res.json(usersWithPhotoPaths);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès", user: deletedUser });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const assignUeToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { ueId, role } = req.body; // role attendu ici : 'participant' ou 'enseignant'

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const ue = await Ue.findById(ueId);
    if (!ue) return res.status(404).json({ message: 'UE non trouvée' });

    // Vérification cohérence rôle global et rôle UE
    const userRoles = user.role; // supposé être un tableau comme ['ROLE_ETUDIANT'] ou ['ROLE_PROF']

    // Si l'utilisateur a ROLE_ETUDIANT, il ne peut être que participant
    if (userRoles.includes('ROLE_ETUDIANT') && role !== 'participant') {
      return res.status(400).json({ message: "Un étudiant ne peut être que participant." });
    }

    // Si l'utilisateur a ROLE_PROF, il ne peut être que enseignant
    if (userRoles.includes('ROLE_PROF') && role !== 'enseignant') {
      return res.status(400).json({ message: "Un professeur ne peut être que enseignant." });
    }

    const alreadyAssigned = user.cours.some(c => c.ue_code?.toString() === ueId);
    if (!alreadyAssigned) {
      user.cours.push({
        ue_code: ue._id,
        nom: ue.nom,
        imageUe: ue.image || null,
        dernierAcces: new Date(),
        role: role  // stocker aussi le rôle dans l'UE
      });

      await user.save();

      if (role === 'participant') {
        ue.participants.push({
          user_id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email
        });
      } else if (role === 'enseignant') {
        ue.enseignants.push({
          user_id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email
        });
      }

      await ue.save();
    }

    res.status(200).json({ message: 'UE assignée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const removeUeFromUser = async (req, res) => {
  try {
    const { userId, ueId } = req.params;
    console.log('removeUeFromUser params:', { userId, ueId });


    // Récupération de l'utilisateur
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Récupération de l'UE
    const ue = await Ue.findById(ueId);
    if (!ue) return res.status(404).json({ message: "UE non trouvée" });

    // Retirer l'UE des cours de l'utilisateur
    user.cours = user.cours.filter(c => c.ue_code.toString() !== ueId);
    await user.save();

    // Retirer l'utilisateur des participants de l'UE
    ue.participants = ue.participants.filter(
        p => p.user_id.toString() !== user._id.toString()
    );
    await ue.save();

    res.status(200).json({ message: "UE retirée avec succès", cours: user.cours });
  } catch (error) {
    console.error("Erreur lors du retrait de l’UE :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getUserCourses = async (req, res) => {
  try {
    const userId = req.params.userId;


    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const role = user.role[0]; // "ROLE_ETUDIANT" ou "ROLE_PROF"

    let filter = {};
    if (role === 'ROLE_ETUDIANT') {
      filter = { 'participants.user_id': userId };
    } else if (role === 'ROLE_PROF') {
      filter = { 'enseignants.user_id': userId };
    } else {
      return res.status(400).json({ message: 'Rôle non supporté' });
    }

    const ues = await Ue.find(filter);

    //  pour accéder aux images
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imagesPath = '/uploads/ues/';

    //  champ imageUrl pour chaque UE
    const uesWithImageUrl = ues.map(ue => {
      const ueObj = ue.toObject();
      ueObj.imageUrl = ue.image ? baseUrl + imagesPath + ue.image : null;
      return ueObj;
    });

    res.json(uesWithImageUrl);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des UEs' });
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const newPassword = generatePassword();

    user.password = newPassword;
    await user.save();

    await sendEmail(
        email,
        'Réinitialisation de votre mot de passe',
        `Bonjour ${user.prenom},\n\nVoici votre nouveau mot de passe : ${newPassword}\n\nMerci de le modifier après connexion.`
    );

    res.status(200).json({ message: 'Nouveau mot de passe envoyé par email.' });
  } catch (error) {
    console.error('Erreur resetPassword:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  getUserCourses,
  getAllUsers,
  updateUser,
  deleteUser,
  updateProfile,
  getUserPhoto,
  assignUeToUser,
  removeUeFromUser,
  registerUser,
  resetPassword
};