import React, { useEffect, useState } from 'react';
import { api } from './services/api';
import { PokemonCard } from './components/PokemonCard';

export function App() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function loadTeams() {
      try {
        const response = await api.get('/teams');
        setTeams(response.data);
      } catch (error) {
        console.error('Erro ao buscar times:', error);
      }
    }
    loadTeams();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">🏆 Pokémon Hall da Fama</h1>
      {teams.map((team) => (
        <div key={team.id} className="bg-slate-800 p-6 rounded-xl mb-6 border border-slate-700">
          <h2 className="text-xl font-bold">Treinador: {team.trainerName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
            {team.pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;