// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();


router.post('/register', async (req, res) => {
  const { email, senha } = req.body;

  const hashedsenha = await bcrypt.hash(senha, 10);
  const newUser = new User({ email, senha: hashedsenha });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou senha incorretos' });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou senha incorretos' });
    }

    res.json({ message: 'Login bem-sucedido', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/user/events/:email', async (req, res) => {
  
    const { email } = req.params;
    const { title, start, end, content, class: eventClass } = req.body;
   
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      user.events.push({ title, start, end, content, class: eventClass });
      await user.save();
      
  
      res.json(user);
    } catch (err) {
       
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/user/events/:email', async (req, res) => {
    const { email } = req.params;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      res.json(user.events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  router.put('/user/events/:email', async (req, res) => {
    const { email } = req.params;
    const { start, end, title, content, class: eventClass } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      // Encontra o evento pelo intervalo de datas original
      const eventToUpdate = user.events.find(e => { 
        return e.start == start && e.end == end;
        

      });
  
      if (!eventToUpdate) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }
  
      // Atualiza os dados do evento
      eventToUpdate.title = title;
      
      eventToUpdate.content = content;
      eventToUpdate.class = eventClass;
  
      await user.save();
  
      res.json(eventToUpdate); // Retorna o evento atualizado
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.delete('/user/events/:email', async (req, res) => {
    const { email } = req.params;
    const { start, end } = req.query;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      const eventIndex = user.events.findIndex(event => event.start === start && event.end === end);
      if (eventIndex === -1) {
        return res.status(404).json({ message: 'Evento não encontrado' });
      }
  
      user.events.splice(eventIndex, 1);
      await user.save();
  
      res.json({ message: 'Evento deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;