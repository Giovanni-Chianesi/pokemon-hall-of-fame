import { Request, Response } from 'express';
import { TeamService } from '../services/TeamService';

const teamService = new TeamService();

export class TeamController {
  // POST /teams -> Criar um novo time do Hall da Fama
  async create(req: Request, res: Response) {
    try {
      const team = await teamService.createTeam(req.body);
      return res.status(201).json(team);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // GET /teams -> Listar todos os times cadastrados
  async index(req: Request, res: Response) {
    try {
      const teams = await teamService.getAllTeams();
      return res.json(teams);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /teams/:id/analysis -> Buscar um time específico com a análise do Python
  async getAnalysis(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const teamWithAnalysis = await teamService.getTeamWithAnalysis(id);
      return res.json(teamWithAnalysis);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}