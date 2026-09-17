import { Request, Response } from 'express';
import { TeamService } from '../services/TeamService';

const teamService = new TeamService();

export class TeamController {
  async create(req: Request, res: Response) {
    try {
      const team = await teamService.createTeam(req.body);
      return res.status(201).json(team);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao cadastrar time.', details: error });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const teams = await teamService.getAllTeams();
      return res.status(200).json(teams);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar times.' });
    }
  }
}