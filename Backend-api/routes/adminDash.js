const express = require('express');
const {getAdminStats} = require("../controllers/dashAdminController");
const router = express.Router();


router.get('/stats', getAdminStats);

module.exports = router;
