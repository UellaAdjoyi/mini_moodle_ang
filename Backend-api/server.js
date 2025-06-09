const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');   
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');

dotenv.config();
const app = express();



// Middlewares
app.use(cors()); // Activer CORS
app.use(express.json()); // Pour parser le JSON des requêtes entrantes
app.use(express.urlencoded({ extended: false })); // Pour parser les données de formulaires

// Routes
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes); // Authentification des utilisateurs



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