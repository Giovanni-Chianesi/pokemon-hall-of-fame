import { useEffect, useState } from 'react';
import { api } from './api';

const EMPTY_POKEMON = {
  pokemonName: '',
  pokedexNumber: '',
  nickname: '',
  level: 50,
};

export function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados do Formulário
  const [trainerName, setTrainerName] = useState('');
  const [gameTitle, setGameTitle] = useState('Pokémon Emerald');
  const [notes, setNotes] = useState('');
  const [pokemons, setPokemons] = useState([
    { ...EMPTY_POKEMON },
  ]);

  // Modal / Análise selecionada
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Carregar times cadastrados
  async function loadTeams() {
    try {
      setLoading(true);
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Erro ao buscar times:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeams();
  }, []);

  // Manipular campos do time de Pokémon
  const handlePokemonChange = (index, field, value) => {
    const updated = [...pokemons];
    updated[index][field] = value;
    setPokemons(updated);
  };

  const addPokemonSlot = () => {
    if (pokemons.length < 6) {
      setPokemons([...pokemons, { ...EMPTY_POKEMON }]);
    }
  };

  const removePokemonSlot = (index) => {
    if (pokemons.length > 1) {
      setPokemons(pokemons.filter((_, i) => i !== index));
    }
  };

  // Enviar novo time para a API Node.js
  const handleSubmitTeam = async (e) => {
    e.preventDefault();

    if (!trainerName.trim()) {
      alert('Por favor, informe o nome do treinador!');
      return;
    }

    const validPokemons = pokemons
      .filter((p) => p.pokemonName.trim() !== '')
      .map((p, index) => ({
        pokemonName: p.pokemonName.toLowerCase().trim(),
        pokedexNumber: Number(p.pokedexNumber) || 1,
        nickname: p.nickname,
        level: Number(p.level) || 50,
        slotPosition: index + 1,
      }));

    if (validPokemons.length === 0) {
      alert('Adicione pelo menos 1 Pokémon com nome válido!');
      return;
    }

    try {
      // Criação básica do payload (O backend pode criar o jogo dinamicamente ou usar um id mock)
      await api.post('/teams', {
        trainerName,
        gameTitle,
        notes,
        pokemons: validPokemons,
      });

      alert('🏆 Time registrado com sucesso no Hall da Fama!');
      setTrainerName('');
      setNotes('');
      setPokemons([{ ...EMPTY_POKEMON }]);
      loadTeams();
    } catch (error) {
      console.error('Erro ao cadastrar time:', error);
      alert('Erro ao cadastrar time. Verifique se o backend está rodando.');
    }
  };

  // Buscar análise de fraquezas em Python
  const handleFetchAnalysis = async (teamId) => {
    try {
      setLoadingAnalysis(true);
      const response = await api.get(`/teams/${teamId}/analysis`);
      setSelectedAnalysis(response.data);
    } catch (error) {
      console.error('Erro ao buscar análise:', error);
      alert('Não foi possível conectar ao serviço de análise Python.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>🏆 Pokémon Hall of Fame Tracker</h1>
        <p>Registre seus times campeões de Pokémon e HackRoms</p>
      </header>

      {/* --- FORMULÁRIO DE CADASTRO --- */}
      <section style={{ backgroundColor: '#fff', border: '2px solid #e0e0e0', padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2>📝 Cadastrar Novo Time Campeão</h2>

        <form onSubmit={handleSubmitTeam}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label><strong>Nome do Treinador:</strong></label>
              <input
                type="text"
                placeholder="Ex: Ash Ketchum"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label><strong>Jogo / HackRom:</strong></label>
              <input
                type="text"
                placeholder="Ex: Pokémon FireRed / Radical Red"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label><strong>Observações / Notas da Run:</strong></label>
            <input
              type="text"
              placeholder="Ex: Zerado sem itens no meio de batalha!"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>

          <h3>⚡ Integrantes do Time (Até 6)</h3>
          
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
            {pokemons.map((pokemon, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '0.8rem', borderRadius: '8px', border: '1px solid #eee' }}>
                <span style={{ fontWeight: 'bold', width: '25px' }}>#{index + 1}</span>

                <input
                  type="text"
                  placeholder="Nome do Pokémon (ex: pikachu)"
                  value={pokemon.pokemonName}
                  onChange={(e) => handlePokemonChange(index, 'pokemonName', e.target.value)}
                  style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />

                <input
                  type="number"
                  placeholder="Nº PokéDex"
                  value={pokemon.pokedexNumber}
                  onChange={(e) => handlePokemonChange(index, 'pokedexNumber', e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />

                <input
                  type="text"
                  placeholder="Apelido (opcional)"
                  value={pokemon.nickname}
                  onChange={(e) => handlePokemonChange(index, 'nickname', e.target.value)}
                  style={{ flex: 1.5, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />

                <input
                  type="number"
                  placeholder="Nível"
                  value={pokemon.level}
                  onChange={(e) => handlePokemonChange(index, 'level', e.target.value)}
                  style={{ width: '70px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />

                {pokemons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePokemonSlot(index)}
                    style={{ backgroundColor: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem 0.8rem', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {pokemons.length < 6 && (
            <button
              type="button"
              onClick={addPokemonSlot}
              style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.6rem 1.2rem', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}
            >
              + Adicionar Pokémon
            </button>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

          <button
            type="submit"
            style={{ width: '100%', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Salvar Time no Hall da Fama
          </button>
        </form>
      </section>

      {/* --- LISTAGEM DE TIMES --- */}
      <section>
        <h2>🏅 Galeria de Times Campeões</h2>

        {loading ? (
          <p>Carregando times do banco de dados...</p>
        ) : teams.length === 0 ? (
          <p>Nenhum time registrado ainda. Cadastre o seu primeiro time acima!</p>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
            {teams.map((team) => (
              <div
                key={team.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  padding: '1.2rem',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Treinador: {team.trainerName}</h3>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>🎮 {team.game?.title || 'Jogo Não Especificado'}</span>
                  </div>
                  <button
                    onClick={() => handleFetchAnalysis(team.id)}
                    style={{ backgroundColor: '#17a2b8', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🔍 Analisar Fraquezas (Python)
                  </button>
                </div>

                {team.notes && <p style={{ fontStyle: 'italic', color: '#555', marginTop: '0.5rem' }}>"{team.notes}"</p>}

                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {team.pokemons?.map((pokemon) => (
                    <div
                      key={pokemon.id || pokemon.slotPosition}
                      style={{
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        textAlign: 'center',
                        backgroundColor: '#f8f9fa',
                        minWidth: '110px',
                      }}
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexNumber || 1}.png`}
                        alt={pokemon.pokemonName}
                        style={{ width: '70px', height: '70px' }}
                      />
                      <p style={{ margin: '0.2rem 0', fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {pokemon.nickname ? `${pokemon.nickname}` : pokemon.pokemonName}
                      </p>
                      {pokemon.nickname && <small style={{ display: 'block', color: '#777', textTransform: 'capitalize' }}>({pokemon.pokemonName})</small>}
                      <span style={{ fontSize: '0.8rem', backgroundColor: '#e2e8f0', padding: '0.2rem 0.4rem', borderRadius: '4px', marginTop: '0.3rem', display: 'inline-block' }}>
                        Lv. {pokemon.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- MODAL DA ANÁLISE PYTHON --- */}
      {selectedAnalysis && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2>📊 Análise do Time (Serviço FastAPI)</h2>
            <p><strong>Treinador:</strong> {selectedAnalysis.trainerName}</p>

            {selectedAnalysis.analysis ? (
              <div>
                <p><strong>Total de Pokémon analisados:</strong> {selectedAnalysis.analysis.total_pokemons}</p>

                {selectedAnalysis.analysis.vulnerabilities?.length > 0 && (
                  <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.8rem', borderRadius: '6px', margin: '1rem 0' }}>
                    ⚠️ <strong>Vulnerabilidades Críticas (3+ Pokémon fracos):</strong>
                    <ul style={{ margin: '0.5rem 0 0 1.2rem', padding: 0 }}>
                      {selectedAnalysis.analysis.vulnerabilities.map((type) => (
                        <li key={type} style={{ textTransform: 'capitalize' }}>Tipo {type}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <h4>Resumo de Fraquezas por Tipo:</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {Object.entries(selectedAnalysis.analysis.team_weaknesses || {}).map(([type, count]) => (
                    <span key={type} style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                      {type}: +{count}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: '#dc3545' }}>Não foi possível carregar os dados de análise do Python.</p>
            )}

            <button
              onClick={() => setSelectedAnalysis(null)}
              style={{ marginTop: '1.5rem', backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
            >
              Fechar Análise
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;