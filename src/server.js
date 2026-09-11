require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const treinadoresRoutes = require('./routes/treinadores');
const movesRoutes = require('./routes/moves');

const app = express();

app.use(cors()); // permite que o React (rodando em outra porta) chame essa API
app.use(express.json()); // permite ler JSON no corpo das requisições (req.body)

// Cada "require" de rota vira um grupo de endpoints com um prefixo:
app.use('/auth', authRoutes);
app.use('/treinadores', treinadoresRoutes);
app.use('/moves', movesRoutes);

// Rota simples só pra confirmar que o servidor está de pé
app.get('/', (req, res) => {
  res.json({ status: 'API do Pokémon Team Tracker rodando 🎮' });
});

const PORTA = process.env.PORT || 3333;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
