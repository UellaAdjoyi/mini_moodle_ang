const User = require('../models/user');

//fonction pour recupérérer les uee suivi ou enseigné par un utilisateur 
const getUserCourses = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('cours');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé.',
      });
    }

    res.status(200).json({
      success: true,
      data: user.cours,
    });

  } catch (error) {
    console.error(error);
    console.error("Erreur lors de la récupération des cours de l'utilisateur :", error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur.',
    });
  }
};


module.exports = {
  getUserCourses              
};