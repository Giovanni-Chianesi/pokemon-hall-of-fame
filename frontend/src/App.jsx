import React, { useEffect, useState } from 'react';
import { api } from './api';
import { PokemonAutocomplete } from './components/PokemonAutocomplete.jsx';
import './app.css';

const EMPTY_POKEMON = {
  pokemonName: '',
  pokedexNumber: '',
  nickname: '',
  level: 50,
};

function getErrorMessage(error) {
  return error.response?.data?.error || error.response?.data?.message || 'Não foi possível conectar ao backend. Confira se a API está rodando.';
}

export function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listError, setListError] = useState('');
  const [formMessage, setFormMessage] = useState(null);
  const [trainerName, setTrainerName] = useState('');
  const [gameTitle, setGameTitle] = useState('Pokémon Emerald');
  const [notes, setNotes] = useState('');
  const [pokemons, setPokemons] = useState([{ ...EMPTY_POKEMON }]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  async function loadTeams() {
    try {
      setListError('');
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (error) {
      setListError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeams();
  }, []);

  function handlePokemonChange(index, field, value) {
    setPokemons((current) => current.map((pokemon, position) => (
      position === index
        ? { ...pokemon, [field]: value, ...(field === 'pokemonName' ? { pokedexNumber: '' } : {}) }
        : pokemon
    )));
  }

  function handlePokemonSelect(index, pokemonOption) {
    setPokemons((current) => current.map((pokemon, position) => (
      position === index
        ? { ...pokemon, pokemonName: pokemonOption.name, pokedexNumber: pokemonOption.id }
        : pokemon
    )));
  }

  function addPokemonSlot() {
    setPokemons((current) => current.length < 6 ? [...current, { ...EMPTY_POKEMON }] : current);
  }

  function removePokemonSlot(index) {
    setPokemons((current) => current.length > 1 ? current.filter((_, position) => position !== index) : current);
  }

  async function handleSubmitTeam(event) {
    event.preventDefault();
    setFormMessage(null);

    const validPokemons = pokemons
      .map((pokemon, index) => ({ pokemon, slotPosition: index + 1 }))
      .filter(({ pokemon }) => pokemon.pokemonName.trim())
      .map(({ pokemon, slotPosition }) => ({
        pokemonName: pokemon.pokemonName.toLowerCase().trim(),
        pokedexNumber: Number(pokemon.pokedexNumber) || 1,
        nickname: pokemon.nickname.trim(),
        level: Number(pokemon.level) || 50,
        slotPosition,
      }));

    if (validPokemons.length === 0) {
      setFormMessage({ type: 'error', text: 'Adicione pelo menos um Pokémon ao time.' });
      return;
    }

    try {
      setSaving(true);
      await api.post('/teams', {
        trainerName: trainerName.trim(),
        gameTitle: gameTitle.trim(),
        notes: notes.trim(),
        pokemons: validPokemons,
      });

      setFormMessage({ type: 'success', text: 'Time registrado no Hall da Fama.' });
      setTrainerName('');
      setNotes('');
      setPokemons([{ ...EMPTY_POKEMON }]);
      await loadTeams();
    } catch (error) {
      setFormMessage({ type: 'error', text: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleFetchAnalysis(teamId) {
    try {
      setLoadingAnalysis(true);
      setAnalysisError('');
      const response = await api.get(`/teams/${teamId}/analysis`);
      setSelectedAnalysis(response.data);
    } catch (error) {
      setAnalysisError(getErrorMessage(error));
    } finally {
      setLoadingAnalysis(false);
    }
  }

  const pokemonCount = teams.reduce((total, team) => total + (team.pokemons?.length || 0), 0);
  const completedTeamCount = teams.filter((team) => team.pokemons?.length === 6).length;
  const gameCount = new Set(teams.map((team) => team.game?.title).filter(Boolean)).size;

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#inicio" aria-label="Pokémon Hall of Fame, início">
            <span className="brand-mark">H</span>
            <span>HALL OF FAME<span className="brand-subtitle">ARQUIVO DE TREINADORES</span></span>
          </a>
          <nav className="topbar-nav" aria-label="Navegação principal">
            <a className="nav-link current" href="#inicio">Início</a>
            <a className="nav-link" href="#novo-time">Novo time</a>
            <a className="nav-link" href="#galeria">Hall da Fama</a>
            <a className="nav-link" href="#sobre">Sobre</a>
            <a className="topbar-cta" href="#novo-time">Registrar time <span aria-hidden="true">+</span></a>
          </nav>
        </div>
      </header>

      <main id="inicio" className="page-content">
        <section className="intro" aria-labelledby="page-title">
          <div className="intro-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> ARQUIVO CENTRAL DE TREINADORES</p>
            <h1 id="page-title">Seu nome.<br />Sua equipe.<br /><span>Sua lenda.</span></h1>
            <p className="intro-description">Toda jornada deixa marcas. Aqui, as melhores equipes ficam para a história.</p>
          </div>
          <div className="intro-stamp" aria-hidden="true">
            <span>HALL DA FAMA</span>
            <strong>H</strong>
            <span>REGISTRO Nº 001</span>
          </div>
        </section>

        <section className="collection-stats" aria-label="Painel da coleção">
          <article className="stat-card"><span className="stat-kicker">01 / REGISTROS</span><strong className="stat-number">{teams.length.toString().padStart(2, '0')}</strong><span className="stat-label">times no Hall da Fama</span></article>
          <article className="stat-card"><span className="stat-kicker">02 / ELENCO</span><strong className="stat-number">{pokemonCount.toString().padStart(2, '0')}</strong><span className="stat-label">Pokémon registrados</span></article>
          <article className="stat-card"><span className="stat-kicker">03 / CONQUISTAS</span><strong className="stat-number">{completedTeamCount.toString().padStart(2, '0')}</strong><span className="stat-label">equipes completas · {gameCount} {gameCount === 1 ? 'jogo' : 'jogos'}</span></article>
        </section>

        <section id="novo-time" className="form-section" aria-labelledby="form-title">
          <div className="section-heading">
            <div><p className="eyebrow">NOVO REGISTRO <span className="heading-index">/ 01</span></p><h2 id="form-title">Registre uma equipe</h2></div>
            <span className="section-aside">Sua próxima lenda começa aqui</span>
          </div>

          <form className="team-form" onSubmit={handleSubmitTeam}>
            <div className="form-grid form-grid-two">
              <label className="field">
                <span>Nome do treinador</span>
                <input type="text" placeholder="Ex.: Ash Ketchum" value={trainerName} onChange={(event) => setTrainerName(event.target.value)} required maxLength={80} />
              </label>
              <label className="field">
                <span>Jogo ou ROM hack</span>
                <input type="text" placeholder="Ex.: Pokémon Emerald" value={gameTitle} onChange={(event) => setGameTitle(event.target.value)} required maxLength={100} />
              </label>
            </div>
            <label className="field notes-field">
              <span>Notas da jornada <span className="field-optional">OPCIONAL</span></span>
              <textarea placeholder="Uma estratégia inesquecível, um desafio especial..." value={notes} onChange={(event) => setNotes(event.target.value)} rows="2" maxLength={500} />
            </label>

            <div className="roster-heading">
              <div><h3>Equipe campeã</h3><p>Inclua de 1 a 6 integrantes.</p></div>
              <span className="roster-count">{pokemons.length} / 6</span>
            </div>

            <div className="pokemon-fields">
              {pokemons.map((pokemon, index) => (
                <div className="pokemon-row" key={index}>
                  <span className="pokemon-position">{String(index + 1).padStart(2, '0')}</span>
                  <PokemonAutocomplete
                    index={index}
                    value={pokemon.pokemonName}
                    onChange={(value) => handlePokemonChange(index, 'pokemonName', value)}
                    onSelect={(option) => handlePokemonSelect(index, option)}
                  />
                  <label className="field pokemon-number-field">
                    <span className="visually-hidden">Número na Pokédex</span>
                    <input type="number" placeholder="# Pokédex" min="1" max="1025" value={pokemon.pokedexNumber} onChange={(event) => handlePokemonChange(index, 'pokedexNumber', event.target.value)} />
                  </label>
                  <label className="field pokemon-nickname-field">
                    <span className="visually-hidden">Apelido opcional</span>
                    <input type="text" placeholder="Apelido" value={pokemon.nickname} onChange={(event) => handlePokemonChange(index, 'nickname', event.target.value)} maxLength={40} />
                  </label>
                  <label className="field pokemon-level-field">
                    <span className="visually-hidden">Nível</span>
                    <input type="number" aria-label={`Nível do Pokémon ${index + 1}`} min="1" max="100" placeholder="Nv." value={pokemon.level} onChange={(event) => handlePokemonChange(index, 'level', event.target.value)} />
                  </label>
                  {pokemons.length > 1 && <button className="remove-pokemon" type="button" onClick={() => removePokemonSlot(index)} title="Remover Pokémon" aria-label={`Remover Pokémon ${index + 1}`}>×</button>}
                </div>
              ))}
            </div>

            {pokemons.length < 6 && <button className="add-pokemon" type="button" onClick={addPokemonSlot}><span aria-hidden="true">+</span> Adicionar Pokémon</button>}

            {formMessage && <p className={`form-message ${formMessage.type}`} role="status">{formMessage.text}</p>}

            <div className="form-footer">
              <span className="form-footnote">Natureza padrão: Hardy</span>
              <button className="submit-button" type="submit" disabled={saving}>
                {saving ? 'Registrando...' : 'Salvar no Hall da Fama'} <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>
        </section>

        <section id="galeria" className="gallery-section" aria-labelledby="gallery-title">
          <div className="section-heading gallery-heading">
            <div><p className="eyebrow">REGISTROS DA COMUNIDADE <span className="heading-index">/ 02</span></p><h2 id="gallery-title">Galeria de campeões</h2></div>
            <span className="section-aside">{teams.length} {teams.length === 1 ? 'jornada' : 'jornadas'}</span>
          </div>

          {loading && <div className="empty-state"><span className="loading-mark" /> Carregando registros...</div>}
          {!loading && listError && <div className="empty-state error-state"><p>{listError}</p><button className="text-button" type="button" onClick={loadTeams}>Tentar novamente</button></div>}
          {!loading && !listError && teams.length === 0 && <div className="empty-state"><span className="empty-star" aria-hidden="true">✳</span><p>Ainda não há equipes registradas.<br />Sua jornada pode inaugurar a galeria.</p></div>}

          {!loading && !listError && teams.length > 0 && (
            <div className="team-list">
              {teams.map((team) => (
                <article className="team-entry" key={team.id}>
                  <div className="team-entry-top">
                    <div>
                      <p className="team-game">{team.game?.title || 'Jogo não especificado'}</p>
                      <h3>{team.trainerName}</h3>
                    </div>
                    <button className="analysis-button" type="button" onClick={() => handleFetchAnalysis(team.id)} disabled={loadingAnalysis}>
                      {loadingAnalysis ? 'Analisando...' : 'Analisar equipe'} <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                  {team.notes && <p className="team-notes">“{team.notes}”</p>}
                  <div className="team-roster">
                    {team.pokemons?.map((pokemon) => (
                      <div className="roster-pokemon" key={pokemon.id || pokemon.slotPosition}>
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexNumber || 1}.png`} alt="" loading="lazy" />
                        <div><strong>{pokemon.nickname || pokemon.pokemonName}</strong><span>{pokemon.nickname && `${pokemon.pokemonName} · `}Nv. {pokemon.level}</span></div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="sobre" className="about-section" aria-labelledby="about-title">
          <div><p className="eyebrow">SOBRE O ARQUIVO <span className="heading-index">/ 03</span></p><h2 id="about-title">Feito de jornadas.<br /><span>Guardado para sempre.</span></h2></div>
          <p>O Hall da Fama reúne equipes de jogos principais e ROM hacks em um só lugar. Cada registro preserva quem treinou, por onde passou e quem esteve ao seu lado.</p>
          <span className="about-seal" aria-hidden="true">H<br /><small>OF</small></span>
        </section>
      </main>

      <footer className="site-footer"><span>POKÉMON HALL OF FAME</span><span>FEITO PARA CELEBRAR CADA JORNADA</span></footer>

      {analysisError && <div className="toast-error" role="alert">{analysisError}<button type="button" onClick={() => setAnalysisError('')} aria-label="Fechar aviso">×</button></div>}

      {selectedAnalysis && (
        <div className="modal-backdrop" onClick={() => setSelectedAnalysis(null)}>
          <section className="analysis-modal" role="dialog" aria-modal="true" aria-labelledby="analysis-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setSelectedAnalysis(null)} aria-label="Fechar análise">×</button>
            <p className="eyebrow">RELATÓRIO TÁTICO</p>
            <h2 id="analysis-title">Análise da equipe</h2>
            <p className="analysis-trainer">Treinador <strong>{selectedAnalysis.trainerName}</strong></p>
            {selectedAnalysis.analysis ? (
              <>
                <p className="analysis-total">{selectedAnalysis.analysis.total_pokemons} Pokémon analisados</p>
                {selectedAnalysis.analysis.vulnerabilities?.length > 0 && (
                  <div className="weakness-warning"><strong>Vulnerabilidades críticas</strong><span>{selectedAnalysis.analysis.vulnerabilities.map((type) => type).join(', ')}</span></div>
                )}
                <div className="analysis-columns">
                  <div><h3>Fraquezas</h3><div className="type-list">{Object.entries(selectedAnalysis.analysis.team_weaknesses || {}).map(([type, count]) => <span className="type-chip weakness" key={type}>{type} <b>{count}</b></span>)}</div></div>
                  <div><h3>Resistências</h3><div className="type-list">{Object.entries(selectedAnalysis.analysis.team_resistances || {}).map(([type, count]) => <span className="type-chip resistance" key={type}>{type} <b>{count}</b></span>)}</div></div>
                </div>
              </>
            ) : <p className="analysis-unavailable">O serviço de análise não retornou dados para esta equipe.</p>}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;