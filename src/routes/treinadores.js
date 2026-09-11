const express = require('express');
const prisma = require('../prisma/client');
const autenticar = require('../middleware/autenticacao');

const router = express.Router();

// Todas as rotas aqui embaixo passam primeiro pelo middleware "autenticar".
// Isso garante que req.usuarioId sempre existe nas rotas abaixo.
router.use(autenticar);

// GET /treinadores → lista só os treinadores do usuário logado
router.get('/', async (req, res) => {
  const treinadores = await prisma.treinador.findMany({
    where: { usuarioId: req.usuarioId },
  });
  return res.json(treinadores);
});

// POST /treinadores → cria um novo treinador para o usuário logado
router.post('/', async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'Nome do treinador é obrigatório.' });
  }

  const treinador = await prisma.treinador.create({
    data: { nome, usuarioId: req.usuarioId },
  });

  return res.status(201).json(treinador);
});

// GET /treinadores/:id → detalhes de um treinador, incluindo seus times
router.get('/:id', async (req, res) => {
  const treinador = await prisma.treinador.findUnique({
    where: { id: Number(req.params.id) },
    include: { times: true },
  });

  if (!treinador) {
    return res.status(404).json({ erro: 'Treinador não encontrado.' });
  }

  // Checagem de posse: mesmo estando logado, só o dono pode ver o próprio treinador.
  if (treinador.usuarioId !== req.usuarioId) {
    return res.status(403).json({ erro: 'Esse treinador não pertence a você.' });
  }

  return res.json(treinador);
});

module.exports = router;
