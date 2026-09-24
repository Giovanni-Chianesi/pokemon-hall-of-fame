import { useEffect, useState } from 'react';
import { api } from './api';

export function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      try {
        const response = await api.get('/teams');
        setTeams(response.data);
      } catch (error) {
        console.error('Erro ao carregar o Hall da Fama:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🏆 Pokémon Hall of Fame</h1>

      {loading ? (
        <p>Carregando times campeões...</p>
      ) : teams.length === 0 ? (
        <p>Nenhum time registrado ainda no Hall da Fama.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
          {teams.map((team) => (
            <div
              key={team.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h2>Treinador: {team.trainerName}</h2>
              <p><strong>Jogo:</strong> {team.game?.title || 'Não informado'}</p>
              {team.notes && <p><em>"{team.notes}"</em></p>}

              <h3>Time Campeão:</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {team.pokemons?.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      padding: '0.5rem',
                      textAlign: 'center',
                      backgroundColor: '#fff',
                      minWidth: '100px',
                    }}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexNumber}.png`}
                      alt={pokemon.pokemonName}
                    />
                    <p style={{ margin: '0.2rem 0', fontWeight: 'bold' }}>
                      {pokemon.nickname ? `${pokemon.nickname} (${pokemon.pokemonName})` : pokemon.pokemonName}
                    </p>
                    <small>Lv. {pokemon.level}</small>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;