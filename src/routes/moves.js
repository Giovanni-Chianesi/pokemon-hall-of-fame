const express = require('express');
const prisma = require('../prisma/client');

const router = express.Router();

// Rota PÚBLICA — o catálogo de moves não é dado pessoal de ninguém,
// então não precisa passar pelo middleware de autenticação.

// GET /moves → lista todos os moves já populados no banco (via seed da PokéAPI)
router.get('/', async (req, res) => {
  const moves = await prisma.move.findMany({
    orderBy: { nome: 'asc' },
  });
  return res.json(moves);
});

// GET /moves/:id → detalhe de um move específico
router.get('/:id', async (req, res) => {
  const move = await prisma.move.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!move) {
    return res.status(404).json({ erro: 'Move não encontrado.' });
  }

  return res.json(move);
});

module.exports = router;
