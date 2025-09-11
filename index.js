const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

//conection to mongo db
mongoose.connect('mongodb://localhost:27017/watchnow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//schema and model
const movieSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  director: String,
  year: Number,
  genre: String,
  sinopsis: String,  
  rating: Number,
});

const seriesSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  director: String,
  year: Number,
  genre: String,
  sinopsis: String,  
  rating: Number,
});

const usuario = new mongoose.Schema({
  _id: Number,
  name: String,
  email: String,
  password: String,
  role: String,
});