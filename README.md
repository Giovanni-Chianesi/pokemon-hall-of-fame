# Pokémon Team Tracker — Backend

API em Node.js + Express + Prisma para registrar times de Pokémon usados em cada jogo/hack rom zerado.

## Pré-requisitos

- Node.js instalado (v18+)
- Um banco PostgreSQL rodando (local ou na nuvem, ex: [Neon](https://neon.tech) ou [Railway](https://railway.app), ambos têm planos gratuitos)

## Passo a passo pra rodar

1. Instale as dependências:
   ```
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente e preencha com seus dados reais:
   ```
   cp .env.example .env
   ```
   Edite o `.env` e coloque a URL do seu banco em `DATABASE_URL`, e qualquer string aleatória em `JWT_SECRET`.

3. Crie as tabelas no banco a partir do schema:
   ```
   npx prisma migrate dev --name inicial
   ```
   Esse comando lê o `prisma/schema.prisma` e cria as tabelas de verdade no seu banco.

4. (Opcional, mas recomendado) Popule o catálogo de moves com dados reais da PokéAPI:
   ```
   npm run seed
   ```

5. Suba o servidor em modo desenvolvimento (reinicia sozinho a cada alteração):
   ```
   npm run dev
   ```
   O servidor vai rodar em `http://localhost:3333`.

6. (Opcional) Abra uma interface visual pra ver os dados do banco, tipo uma planilha:
   ```
   npx prisma studio
   ```

## Estrutura de pastas

```
prisma/
  schema.prisma   → define todas as tabelas e relações
  seed.js         → popula o banco com dados reais da PokéAPI
src/
  server.js       → ponto de entrada, monta o Express e as rotas
  prisma/client.js → cliente Prisma compartilhado
  middleware/
    autenticacao.js → valida o token JWT em rotas protegidas
  routes/
    auth.js         → registro e login (rotas públicas)
    treinadores.js  → CRUD de treinadores (rotas protegidas)
    moves.js        → catálogo de moves (rota pública)
```

## Próximos passos sugeridos

- Criar as rotas de `Jogo`, `Time` e `Pokemon` (seguindo o mesmo padrão de `treinadores.js`)
- Criar o front-end em React que consome essa API
- Adicionar validação mais robusta dos dados recebidos (ex: com a biblioteca `zod`)
