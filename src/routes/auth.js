const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const router = express.Router();

// POST /auth/registrar
// Cria um novo usuário. Rota PÚBLICA (não passa pelo middleware de autenticação).
router.post('/registrar', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
  if (usuarioExistente) {
    return res.status(409).json({ erro: 'Já existe um usuário com esse email.' });
  }

  // Nunca salvamos a senha em texto puro — geramos um hash irreversível.
  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: { email, senhaHash },
  });

  return res.status(201).json({ id: usuario.id, email: usuario.email });
});

// POST /auth/login
// Verifica email/senha e devolve um token JWT. Rota PÚBLICA.
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return res.status(401).json({ erro: 'Email ou senha inválidos.' });
  }

  // Compara a senha digitada com o hash salvo no banco.
  const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);
  if (!senhaCorreta) {
    return res.status(401).json({ erro: 'Email ou senha inválidos.' });
  }

  // Gera o token JWT. O payload guarda só o id do usuário — nada sensível.
  const token = jwt.sign({ usuarioId: usuario.id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return res.json({ token });
});

module.exports = router;
