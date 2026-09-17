import express from 'express';
import cors from 'cors';
import { TeamController } from './controllers/TeamController';

const app = express();
const teamController = new TeamController();

app.use(cors());
app.use(express.json());

app.post('/api/teams', teamController.create);
app.get('/api/teams', teamController.index);

app.listen(3333, () => {
  console.log('⚡ API Pokémon rodando em http://localhost:3333');
});