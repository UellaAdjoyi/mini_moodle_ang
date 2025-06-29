const express = require('express');
const router = express.Router();
const { getAllLogs, createLog } = require('../controllers/logController');


// route pour créer un log 
const multer = require('multer');
const upload = multer();
router.post('/createLog', upload.none(), createLog); 

// afficher tous les logs
router.get('/logAll',getAllLogs ) 

// Seuls les admins peuvent voir tous les logs
router.route('/')
    .get( getAllLogs);
module.exports = router;