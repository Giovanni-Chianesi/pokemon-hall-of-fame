import express from 'express';
import cors from 'cors';
import { TeamController } from './controllers/TeamController';

const app = express();
const teamController = new TeamController();

app.use(cors());
app.use(express.json());

app.post('/api/teams', teamController.create);
app.get('/api/teams', teamController.index);
app.get('/api/teams/:id/analysis', teamController.getAnalysis);

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
  console.log(`API Pokémon rodando em http://localhost:${port}`);
});