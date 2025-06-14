const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const ueRoutes = require('./routes/ueRoutes');
const {join} = require("node:path");

dotenv.config();
const app = express();

connectDB(); // Connexion à la base de données MongoDB

app.use('/uploads', express.static(join(__dirname, 'uploads')));


// Middlewares
app.use(cors());
app.use(express.json()); // Pour parser le JSON des requêtes entrantes
app.use(express.urlencoded({ extended: false })); // Pour parser les données de formulaires

// Routes
app.use('/api/ues', ueRoutes);
app.use('/api/auth', authRoutes); // Authentification des utilisateurs


// Route de test
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000; // on utilise le port du .env ou 5000 par défaut

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});