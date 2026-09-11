const jwt = require('jsonwebtoken');

// Esse middleware é o "porteiro" de qualquer rota protegida.
// Ele roda ANTES do controller da rota, e decide se a requisição pode continuar.
function autenticar(req, res, next) {
  // O token vem no cabeçalho: Authorization: Bearer <token>
  const cabecalho = req.headers.authorization;

  if (!cabecalho) {
    return res.status(401).json({ erro: 'Token não enviado.' });
  }

  const [, token] = cabecalho.split(' '); // separa "Bearer" do token em si

  if (!token) {
    return res.status(401).json({ erro: 'Token mal formatado.' });
  }

  try {
    // Verifica se o token é válido e não expirou.
    // Se for válido, ele devolve o payload que guardamos ao criar o token (o id do usuário).
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = payload.usuarioId; // disponibiliza o id do usuário logado pro resto da rota
    return next(); // libera a requisição pro controller seguinte
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = autenticar;
