const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');   
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const ueRoutes = require('./routes/ueRoutes');
const directPostRoutes = require('./routes/directPostRoutes');
const forumRoutes = require('./routes/forumRoutes'); 
const logRoutes = require('./routes/logRoutes');



dotenv.config();
const app = express();

connectDB(); // Connexion à la base de données MongoDB


// Middlewares
app.use(cors()); // Activer CORS
app.use(express.json()); // Pour parser le JSON des requêtes entrantes
app.use(express.urlencoded({ extended: false })); // Pour parser les données de formulaires

// Routes
app.use('/api/ues', ueRoutes); // Routes pour les Unités d'Enseignement (UEs)
app.use('/api/auth', authRoutes); // Authentification des utilisateurs
app.use('/api/posts', directPostRoutes); // Routes pour les posts directs
app.use('/api/forums', forumRoutes); // Routes pour les forums
app.use('/api/logs', logRoutes); // Routes pour les logs


// Charger les variables d'environnement

// Connexion à la base de données
//connectDB(); 

// Route de test
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000; // on utilise le port du .env ou 5000 par défaut

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});