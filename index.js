// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors())

mongoose.connect('mongodb+srv://yangabriel3301:7HOQBaxv9ymi6uvT@cluster0.wg6bcpg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', userRoutes);
app.listen( process.env.PORT || port, () => {
  console.log(`Servidor rodando`);
});
