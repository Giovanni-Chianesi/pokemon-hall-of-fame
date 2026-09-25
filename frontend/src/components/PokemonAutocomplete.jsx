import React, { useEffect, useId, useState } from 'react';

let pokemonCatalogRequest;

function loadPokemonCatalog() {
  if (!pokemonCatalogRequest) {
    pokemonCatalogRequest = fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
      .then((response) => {
        if (!response.ok) throw new Error('Não foi possível carregar o catálogo.');
        return response.json();
      })
      .then((data) => data.results.map(({ name, url }) => ({
        name,
        id: Number(url.match(/\/pokemon\/(\d+)\/?$/)?.[1]),
      })))
      .catch((error) => {
        pokemonCatalogRequest = undefined;
        throw error;
      });
  }

  return pokemonCatalogRequest;
}

function formatPokemonName(name) {
  return name.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function PokemonAutocomplete({ index, value, onChange, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();
  const query = value.trim().toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    if (!isOpen || query.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return undefined;
    }

    let isCurrent = true;
    setIsLoading(true);

    loadPokemonCatalog()
      .then((catalog) => {
        if (!isCurrent) return;
        setSuggestions(catalog.filter((pokemon) => pokemon.name.startsWith(query)).slice(0, 6));
        setActiveIndex(-1);
      })
      .catch(() => {
        if (isCurrent) setSuggestions([]);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [isOpen, query]);

  function selectPokemon(pokemon) {
    onSelect(pokemon);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
    }

    if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      selectPokemon(suggestions[activeIndex]);
    }
  }

  return (
    <div className="field pokemon-name-field autocomplete-field">
      <label className="visually-hidden" htmlFor={`pokemon-name-${index}`}>Nome do Pokémon {index + 1}</label>
      <input
        id={`pokemon-name-${index}`}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && (isLoading || suggestions.length > 0)}
        aria-controls={listboxId}
        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        placeholder="Pokémon"
        autoComplete="off"
        value={value}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        maxLength={40}
      />
      {isOpen && query.length >= 2 && (isLoading || suggestions.length > 0) && (
        <ul className="suggestion-list" id={listboxId} role="listbox" aria-label="Sugestões de Pokémon">
          {isLoading && <li className="suggestion-loading" role="status">Buscando no Pokédex...</li>}
          {!isLoading && suggestions.map((pokemon, optionIndex) => (
            <li
              className={optionIndex === activeIndex ? 'suggestion-option active' : 'suggestion-option'}
              id={`${listboxId}-${optionIndex}`}
              key={pokemon.id}
              role="option"
              aria-selected={optionIndex === activeIndex}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectPokemon(pokemon)}
            >
              <span className="suggestion-number">#{String(pokemon.id).padStart(3, '0')}</span>
              <span>{formatPokemonName(pokemon.name)}</span>
              <span className="suggestion-arrow" aria-hidden="true">↗</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}