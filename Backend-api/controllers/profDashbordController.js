const UE = require('../models/Ue');
const Post = require('../models/Post');
const Forum = require('../models/Forum');

const getCoursesByEnseignant = async (req, res) => {
    try {
        const userId = req.user._id;

        const ues = await UE.find({ 'enseignants.user_id': userId })
            .select('nom code participants');

        res.status(200).json(ues);
    } catch (error) {
        console.error('Erreur lors de la récupération des cours :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getProfDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

      // récupérer les UEs où ce prof est enseignant
        const ues = await UE.find({ 'enseignants.user_id': userId });

        const ueIds = ues.map(ue => ue._id);

      //nombre total de participants dans ces UEs
        let totalParticipants = 0;
        ues.forEach(ue => {
            if (ue.participants) totalParticipants += ue.participants.length;
        });
        let totalEnseignants = 0;
        ues.forEach(ue => {
            if (ue.enseignats) totalEnseignants += ue.enseignants.length;
        });

        // nombre total de posts dans ces UEs
        const totalPosts = await Post.countDocuments({ ue_id: { $in: ueIds } });

        // nombre total de devoirs dans ces UEs
        const totalDevoirs = await Post.countDocuments({ ue_id: { $in: ueIds }, type_post: 'devoir' });

        return res.json({
            totalParticipants,
            totalEnseignants,
            totalDevoirs,
            totalPosts
        });
    } catch (error) {
        console.error("Erreur getProfDashboardStats:", error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};
module.exports={
    getProfDashboardStats,
    getCoursesByEnseignant,
}