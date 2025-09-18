require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

//schema and model
const movieSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  director: String,
  year: Number,
  genre: String,
  sinopsis: String,
  cover: String,
  rating: Number,
});
const Movie = mongoose.model('Movie', movieSchema);

const seriesSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  director: String,
  year: Number,
  genre: String,
  sinopsis: String, 
  cover: String, 
  seasons: Number,
  episodes: Number,
  rating: Number,
});
const Serie = mongoose.model('Serie', seriesSchema);

const usuario = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['administrador', 'usuario'],
    default: 'usuario'
  },
});
const Usuario = mongoose.model('Usuario', usuario);

//conection to mongo db
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Agregar datos de prueba si las colecciones están vacías
  const movieCount = await Movie.countDocuments();
  if (movieCount === 0) {
    await Movie.create([
      { _id: 1, title: 'Inception', director: 'Christopher Nolan', year: 2010, genre: 'Sci-Fi', sinopsis: 'A thief who steals corporate secrets', cover: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=400&fit=crop', rating: 8.8 },
      { _id: 2, title: 'The Matrix', director: 'Wachowski Sisters', year: 1999, genre: 'Action', sinopsis: 'A computer hacker learns reality', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop', rating: 8.7 }
    ]);
    console.log('Sample movies added');
  }
  
  const seriesCount = await Serie.countDocuments();
  if (seriesCount === 0) {
    await Serie.create([
      { _id: 1, title: 'Breaking Bad', director: 'Vince Gilligan', year: 2008, genre: 'Drama', sinopsis: 'A high school chemistry teacher turned methamphetamine producer', cover: 'https://images.unsplash.com/photo-1489599735734-79b4fc8c4c8a?w=300&h=400&fit=crop', seasons: 5, episodes: 62, rating: 9.5 },
      { _id: 2, title: 'Stranger Things', director: 'The Duffer Brothers', year: 2016, genre: 'Sci-Fi', sinopsis: 'Kids in a small town uncover supernatural mysteries', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop', seasons: 4, episodes: 34, rating: 8.7 }
    ]);
    console.log('Sample series added');
  }
  
  const userCount = await Usuario.countDocuments();
  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await Usuario.create([
      { _id: 1, name: 'Admin User', email: 'admin@test.com', password: hashedPassword, role: 'administrador' },
      { _id: 2, name: 'Regular User', email: 'user@test.com', password: hashedPassword, role: 'usuario' }
    ]);
    console.log('Sample users added');
  }
})
.catch((err) => console.error('Error connecting to MongoDB:', err));

//middleware
app.use(express.json());
app.use(express.static('public'));

//cors for development
app.use((req, res, next)=> {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, user-id');
  next();
});

//middleware para verificar rol de admin
const requireAdmin = async (req, res, next) => {
  const userId = req.headers['user-id'];
  if (!userId) return res.status(401).json({ error: 'User ID required' });
  
  const user = await Usuario.findOne({ _id: userId });
  if (!user || user.role !== 'administrador') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

//rutas para películas
app.get('/movies', async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

app.post('/movies', requireAdmin, async (req, res) => {
  const movie = new Movie(req.body);
  await movie.save();
  res.json(movie);
});

app.put('/movies/:id', requireAdmin, async (req, res) => {
  const movie = await Movie.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
  res.json(movie);
});

app.delete('/movies/:id', requireAdmin, async (req, res) => {
  await Movie.findOneAndDelete({ _id: req.params.id });
  res.json({ message: 'Movie deleted' });
});

//rutas para series
app.get('/series', async (req, res) => {
  const series = await Serie.find();
  res.json(series);
});

app.post('/series', requireAdmin, async (req, res) => {
  const serie = new Serie(req.body);
  await serie.save();
  res.json(serie);
});

app.put('/series/:id', requireAdmin, async (req, res) => {
  const serie = await Serie.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
  res.json(serie);
});

app.delete('/series/:id', requireAdmin, async (req, res) => {
  await Serie.findOneAndDelete({ _id: req.params.id });
  res.json({ message: 'Serie deleted' });
});

//ruta temporal para resetear contraseñas
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const user = await Usuario.findOneAndUpdate(
    { email }, 
    { password: hashedPassword }, 
    { new: true }
  );
  
  if (user) {
    res.json({ message: 'Contraseña actualizada', email: user.email });
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

//ruta de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }
  
  const user = await Usuario.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado. Por favor regístrate.' });
  }
  
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  
  res.json({ 
    message: 'Login exitoso', 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    } 
  });
});

//rutas ususarios
app.get('/usuarios', async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});
app.post('/usuarios', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario con contraseña hasheada
    const usuario = new Usuario({
      name,
      email,
      password: hashedPassword,
      role: role || 'usuario'
    });
    
    await usuario.save();
    
    // No devolver la contraseña en la respuesta
    const { password: _, ...userResponse } = usuario.toObject();
    res.json({ message: 'Usuario registrado exitosamente', user: userResponse });
    
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});
app.put('/usuarios/:id', requireAdmin, async (req, res) => {
  const usuario = await Usuario.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
  res.json(usuario);
});
app.delete('/usuarios/:id', requireAdmin, async (req, res) => {
  await Usuario.findOneAndDelete({ _id: req.params.id });
  res.json({ message: 'Usuario deleted' });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});