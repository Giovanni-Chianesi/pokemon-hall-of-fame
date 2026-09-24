import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const ANALYZER_URL = 'http://localhost:8000/analyze-team';

export class TeamService {
  async createTeam(data: any) {
    return await prisma.team.create({
      data: {
        gameId: data.gameId,
        trainerName: data.trainerName,
        notes: data.notes,
        pokemons: {
          create: data.pokemons.map((pokemon: any) => ({
            pokedexNumber: pokemon.pokedexNumber,
            pokemonName: pokemon.pokemonName,
            nickname: pokemon.nickname,
            level: pokemon.level,
            nature: pokemon.nature,
            ability: pokemon.ability,
            heldItem: pokemon.heldItem,
            customSpriteUrl: pokemon.customSpriteUrl,
            slotPosition: pokemon.slotPosition,
            moves: {
              create: pokemon.moves ? pokemon.moves.map((move: any) => ({
                moveName: move.moveName,
                slot: move.slot,
              })) : [],
            },
          })),
        },
      },
      include: {
        game: true,
        pokemons: { include: { moves: true } },
      },
    });
  }

  async getAllTeams() {
    return await prisma.team.findMany({
      include: {
        game: true,
        pokemons: {
          orderBy: { slotPosition: 'asc' },
          include: { moves: { orderBy: { slot: 'asc' } } },
        },
      },
      orderBy: { completedAt: 'desc' },
    });
  }

  // Método para buscar o time + análise em Python
  async getTeamWithAnalysis(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        game: true,
        pokemons: {
          orderBy: { slotPosition: 'asc' },
          include: { moves: true },
        },
      },
    });

    if (!team) {
      throw new Error('Time não encontrado.');
    }

    let analysis = null;
    try {
      // Formata a lista de Pokémon para o schema esperado pelo FastAPI
      const payload = {
        pokemons: team.pokemons.map(p => ({
          pokemonName: p.pokemonName,
          pokedexNumber: p.pokedexNumber,
        })),
      };

      const response = await axios.post(ANALYZER_URL, payload);
      analysis = response.data;
    } catch (error) {
      console.error('Aviso: Não foi possível conectar ao serviço de análise Python.');
    }

    return {
      ...team,
      analysis,
    };
  }
}