import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
              create: pokemon.moves.map((move: any) => ({
                moveName: move.moveName,
                slot: move.slot,
              })),
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
}