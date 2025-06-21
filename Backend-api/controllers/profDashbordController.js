const UE = require('../models/Ue');
const Post = require('../models/Post');
const Forum = require('../models/Forum');

// exports.getProfDashboardStats = async (req, res) => {
//     try {
//         const profId = req.user.id;
//
//         //  Récupérer les UEs enseignées par ce professeur
//         const ues = await UE.find({ "enseignants.user_id": profId });
//
//         const ueIds = ues.map(ue => ue._id);
//
//         //  Nombre total de participants (sans doublons)
//         const totalParticipants = ues.reduce((sum, ue) => sum + ue.participants.length, 0);
//
//         //  Nombre de devoirs créés (dans Post avec type 'devoir')
//         const nbDevoirs = await Post.countDocuments({
//             ue_id: { $in: ueIds },
//             type_post: 'devoir'
//         });
//
//         //  Nombre total de posts (de tout type)
//         const nbPosts = await Post.countDocuments({ ue_id: { $in: ueIds } });
//
//         //  Nombre total de messages dans les forums
//         const forums = await Forum.find({ ue_id: { $in: ueIds } });
//         const totalMessages = forums.reduce((acc, forum) => acc + forum.messages.length, 0);
//
//         res.json({
//             totalParticipants,
//             nbDevoirs,
//             nbPosts,
//             totalMessages
//         });
//
//     } catch (error) {
//         console.error('Erreur dashboard professeur :', error);
//         res.status(500).json({ message: 'Erreur serveur' });
//     }
// };
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