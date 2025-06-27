const User = require('../models/User');
const UE = require('../models/Ue');
const Forum = require('../models/Forum');
const Post = require('../models/Post');

const getAdminStats = async (req, res) => {
    try {
        //  Utilisateurs par rôle
        const usersByRole = await User.aggregate([
            { $unwind: '$role' },
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);
        const totalUsers = await User.countDocuments();

        //  UEs
        const totalUEs = await UE.countDocuments();
        const ueWithParticipants = await UE.countDocuments({ participants: { $exists: true, $not: { $size: 0 } } });
        const ueWithEnseignants = await UE.countDocuments({ enseignants: { $exists: true, $not: { $size: 0 } } });

        //  Forums et Posts
        const totalForums = await Forum.countDocuments();
        const totalPosts = await Post.countDocuments();

        //  Devoirs remis (posts de type devoir)
        const devoirPosts = await Post.find({ type_post: 'devoir' }, { devoirs_remis: 1 });
        const totalDevoirsRemis = devoirPosts.reduce((acc, post) => acc + (post.devoirs_remis?.length || 0), 0);

        //  Messages dans forums
        const forums = await Forum.find({}, { messages: 1 });
        const totalMessages = forums.reduce((acc, forum) => acc + (forum.messages?.length || 0), 0);

        res.json({
            totalUsers,
            usersByRole,
            totalUEs,
            ueWithParticipants,
            ueWithEnseignants,
            totalForums,
            totalPosts,
            totalDevoirsRemis,
            totalMessages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAdminStats,
};
