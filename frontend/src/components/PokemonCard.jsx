import React from 'react';

export function PokemonCard({ pokemon }) {
  const spriteUrl =
    pokemon.customSpriteUrl ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexNumber}.png`;

  return (
    <div className="bg-slate-800 text-white rounded-xl p-4 shadow-md border border-slate-700 flex flex-col items-center">
      <div className="w-full flex justify-between items-center text-xs text-slate-400 mb-2">
        <span>Lv. {pokemon.level}</span>
        <span className="italic">{pokemon.nature}</span>
      </div>
      <img src={spriteUrl} alt={pokemon.pokemonName} className="w-20 h-20 object-contain my-2" />
      <h4 className="font-bold text-md capitalize">{pokemon.pokemonName}</h4>
      {pokemon.nickname && <span className="text-xs text-yellow-400">"{pokemon.nickname}"</span>}
      <div className="w-full grid grid-cols-2 gap-1 mt-3">
        {pokemon.moves?.map((move) => (
          <div key={move.id || move.slot} className="bg-slate-900 text-[10px] p-1 rounded text-center truncate">
            {move.moveName}
          </div>
        ))}
      </div>
    </div>
  );
}