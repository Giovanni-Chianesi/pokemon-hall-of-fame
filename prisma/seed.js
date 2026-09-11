// Esse script roda UMA VEZ (ou sempre que você quiser repopular o banco).
// Ele busca dados reais de moves na PokéAPI e salva na sua tabela Move.
// Para rodar: npm run seed

const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');

const prisma = new PrismaClient();

// Traduz o "damage_class" da PokéAPI (em inglês) pra nossa categoria em português
function traduzirCategoria(damageClass) {
  const mapa = {
    physical: 'Físico',
    special: 'Especial',
    status: 'Status',
  };
  return mapa[damageClass] || damageClass;
}

// Traduz o tipo do move (ex: "fire" → "Fogo"). Lista simplificada dos principais tipos.
function traduzirTipo(tipo) {
  const mapa = {
    normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico',
    grass: 'Planta', ice: 'Gelo', fighting: 'Lutador', poison: 'Venenoso',
    ground: 'Terrestre', flying: 'Voador', psychic: 'Psíquico', bug: 'Inseto',
    rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão', dark: 'Sombrio',
    steel: 'Aço', fairy: 'Fada',
  };
  return mapa[tipo] || tipo;
}

// Lista inicial de moves pra popular — comece pequeno e vá adicionando
// os moves que você realmente usou nos seus times.
const MOVES_INICIAIS = [
  'flamethrower', 'thunderbolt', 'surf', 'earthquake', 'ice-beam',
  'solar-beam', 'shadow-ball', 'dragon-claw', 'close-combat', 'air-slash',
];

async function buscarMoveNaPokeApi(nomeMove) {
  const resposta = await fetch(`https://pokeapi.co/api/v2/move/${nomeMove}`);
  if (!resposta.ok) {
    throw new Error(`Move "${nomeMove}" não encontrado na PokéAPI.`);
  }
  return resposta.json();
}

async function main() {
  console.log(`Buscando ${MOVES_INICIAIS.length} moves na PokéAPI...`);

  for (const nomeMove of MOVES_INICIAIS) {
    const dados = await buscarMoveNaPokeApi(nomeMove);

    // Pega a descrição em inglês (a PokéAPI raramente tem em português)
    const efeito = dados.effect_entries.find((e) => e.language.name === 'en');

    await prisma.move.upsert({
      where: { nome: dados.name },
      update: {}, // se já existir, não sobrescreve
      create: {
        nome: dados.name,
        tipo: traduzirTipo(dados.type.name),
        categoria: traduzirCategoria(dados.damage_class?.name),
        poder: dados.power,
        precisao: dados.accuracy,
        descricao: efeito ? efeito.short_effect : null,
      },
    });

    console.log(`✓ ${dados.name} salvo com sucesso`);
  }

  console.log('Seed finalizado!');
}

main()
  .catch((erro) => {
    console.error('Erro ao rodar o seed:', erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
