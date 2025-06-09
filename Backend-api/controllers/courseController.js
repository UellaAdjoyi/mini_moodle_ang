const { v4: uuidv4 } = require('uuid'); // Pour générer des IDs uniques

// Notre "base de données" en mémoire
let courses = [
  { id: uuidv4(), title: 'Introduction à Angular', description: 'Apprenez les bases d_Angular.', teacher: 'Prof A' },
  { id: uuidv4(), title: 'Node.js pour Débutants', description: 'Découvrez Node.js.', teacher: 'Prof B' },
];

// Récupérer tous les cours
// @route   GET /api/courses
// @access  Public
const getAllCourses = (req, res) => {
  res.status(200).json(courses);
};

// Récupérer un cours par son ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({ message: 'Cours non trouvé' });
  }
};

//  Créer un nouveau cours
// @route   POST /api/courses
// @access  Public (on ajoutera de l'authentification plus tard)
const createCourse = (req, res) => {
  const { title, description, teacher } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Veuillez fournir un titre et une description' });
  }

  const newCourse = {
    id: uuidv4(),
    title,
    description,
    teacher: teacher || 'Professeur non assigné', // Valeur par défaut si non fourni
  };

  courses.push(newCourse);
  res.status(201).json(newCourse); // 201 signifie "Created"
};

//  Mettre à jour un cours
// @route   PUT /api/courses/:id
// @access  Public (on ajoutera de l'authentification plus tard)
const updateCourse = (req, res) => {
  const courseId = req.params.id;
  const { title, description, teacher } = req.body;

  const courseIndex = courses.findIndex(c => c.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({ message: 'Cours non trouvé' });
  }

  // Met à jour seulement les champs fournis, garde les anciens si non fournis
  courses[courseIndex] = {
    ...courses[courseIndex], // Garde les anciennes valeurs
    title: title || courses[courseIndex].title, // Met à jour si fourni
    description: description || courses[courseIndex].description,
    teacher: teacher || courses[courseIndex].teacher,
  };

  res.status(200).json(courses[courseIndex]);
};

//Supprimer un cours
// @route   DELETE /api/courses/:id
// @access  Public 
const deleteCourse = (req, res) => {
  const courseId = req.params.id;
  const initialLength = courses.length;
  courses = courses.filter(c => c.id !== courseId);

  if (courses.length < initialLength) {
    res.status(200).json({ message: 'Cours supprimé avec succès' });
    // Alternativement, vous pouvez renvoyer un statut 204 (No Content)
    // res.status(204).send();
  } else {
    res.status(404).json({ message: 'Cours non trouvé' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
