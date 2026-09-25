import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const ANALYZER_URL = 'http://localhost:8000/analyze-team';

export class TeamService {
  async createTeam(data: any) {
    const gameTitle = data.gameTitle || 'Pokémon Emerald';

    // Procura se o jogo já existe ou cria um novo
    let game = await prisma.game.findFirst({
      where: { title: gameTitle },
    });

    if (!game) {
      game = await prisma.game.create({
        data: {
          title: gameTitle,
        },
      });
    }

    return await prisma.team.create({
      data: {
        trainerName: data.trainerName,
        notes: data.notes,
        gameId: game.id,
        pokemons: {
          create: data.pokemons.map((pokemon: any) => ({
            pokedexNumber: Number(pokemon.pokedexNumber),
            pokemonName: pokemon.pokemonName.toLowerCase(),
            nickname: pokemon.nickname || null,
            level: Number(pokemon.level) || 50,
            slotPosition: Number(pokemon.slotPosition),
          })),
        },
      },
      include: {
        game: true,
        pokemons: {
          orderBy: { slotPosition: 'asc' },
        },
      },
    });
  }

  async getAllTeams() {
    return await prisma.team.findMany({
      include: {
        game: true,
        pokemons: {
          orderBy: { slotPosition: 'asc' },
        },
      },
      orderBy: { completedAt: 'desc' },
    });
  }

  async getTeamWithAnalysis(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        game: true,
        pokemons: {
          orderBy: { slotPosition: 'asc' },
        },
      },
    });

    if (!team) {
      throw new Error('Time não encontrado.');
    }

    let analysis = null;
    try {
      const payload = {
        pokemons: team.pokemons.map((p) => ({
          pokemonName: p.pokemonName,
          pokedexNumber: p.pokedexNumber,
        })),
      };

      const response = await axios.post(ANALYZER_URL, payload);
      analysis = response.data;
    } catch (error) {
      console.error('Erro ao conectar com o microsserviço Python:', error);
    }

    return {
      id: team.id,
      trainerName: team.trainerName,
      notes: team.notes,
      game: team.game,
      pokemons: team.pokemons,
      analysis,
    };
  }
}