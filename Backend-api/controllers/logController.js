const Log = require('../models/Log');

// create log
const createLog = async (req, res) => {
  const { user_id, action, cible_type, cible_id} = req.body;


  try {
    if (!user_id || !action) {
      return res.status(400).json({ message: 'Veuillez fournir  user_id,  action et  cible_type.' });
    }
console.log('BODY RECU :', req.body);
    const date_heure = new Date();

    const logData = {
      user_id, action, cible_type, cible_id,
      date_heure
    };

    

    const newLog = new Log(logData);
    const createdLog = await newLog.save();

    res.status(201).json(createdLog);

  } catch (error) {
    console.error('Erreur createPost:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du post.' });
  }
};

// @desc    Récupérer tous les logs (avec pagination et filtres optionnels)
// @route   GET /api/logs

const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find({});
    res.status(200).json(logs);
  } catch (error) {
    console.error('Erreur getAllLogs:', error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des logs." });
  }
};

module.exports = { getAllLogs, createLog };