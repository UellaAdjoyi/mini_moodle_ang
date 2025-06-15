const User = require("../models/User");
const generatePassword = require("../utils/generatePassword");
const sendEmail = require("../utils/sendEmail");
const Ue = require("../models/Ue");

const registerUser = async (req, res) => {
  const { nom, prenom, email, role, serviceProf, bureauProf } = req.body;
  const photoFile = req.file;

  try {
    if (!nom || !prenom || !email || !role) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }

    const generatedPassword = generatePassword();

    const newUser = new User({
      nom,
      prenom,
      email,
      password: generatedPassword, // le mot de passe sera hashé dans le modèle
      role,
      photo: photoFile ? photoFile.buffer : null,
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

    res.status(201).json({ message: 'Utilisateur enregistré et email envoyé.' });
  } catch (error) {
    console.error('Erreur dans registerUser:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
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

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const fields = ['nom', 'prenom', 'email', 'password', 'date_naissance', 'service_prof', 'bureau_prof', 'dernier_acces', 'role'];

    fields.forEach(field => {
      if (req.body[field]) user[field] = req.body[field];
    });

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();

    // Convertir chaque buffer en base64
    const usersWithPhotos = users.map(user => {
      if (user.photo && user.photo.buffer) {
        const base64Image = Buffer.from(user.photo.buffer).toString('base64');
        user.photo = `data:image/jpeg;base64,${base64Image}`;
      } else if (user.photo) {
        // Cas si photo est directement un buffer (sans .buffer)
        user.photo = `data:image/jpeg;base64,${Buffer.from(user.photo).toString('base64')}`;
      } else {
        user.photo = null;
      }
      return user;
    });

    res.json(usersWithPhotos);
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

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const fields = ['nom', 'prenom', 'email', 'password', 'date_naissance', 'serviceProf', 'bureauProf'];

    fields.forEach(field => {
      if (req.body[field]) user[field] = req.body[field];
    });

    // Gérer l'upload photo si tu utilises multer (cf. plus bas)
    if (req.file) {
      // Si tu stockes la photo en Buffer (comme à l'inscription)
      user.photo = req.file.buffer;
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
//fonction pour recupérérer les uee suivi ou enseigné par un utilisateur
// const getUserCourses = async (req, res) => {
//   const { id } = req.params;
//
//   try {
//     const user = await User.findById(id).select('cours');
//
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'Utilisateur non trouvé.',
//       });
//     }
//
//     res.status(200).json({
//       success: true,
//       data: user.cours,
//     });
//
//   } catch (error) {
//     console.error(error);
//     console.error("Erreur lors de la récupération des cours de l'utilisateur :", error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur serveur.',
//     });
//   }
// };

const getUserCourses = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Récupère l'utilisateur pour connaître son rôle
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const role = user.role[0]; // Exemple : "ROLE_ETUDIANT" ou "ROLE_PROF"

    let filter = {};
    if (role === 'ROLE_ETUDIANT') {
      filter = { 'participants.user_id': userId };
    } else if (role === 'ROLE_PROF') {
      filter = { 'enseignants.user_id': userId };
    } else {
      return res.status(400).json({ message: 'Rôle non supporté' });
    }

    const ues = await Ue.find(filter);
    res.json(ues);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des UEs' });
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
};