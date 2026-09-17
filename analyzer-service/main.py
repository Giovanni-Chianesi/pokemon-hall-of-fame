from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import httpx
import asyncio

app = FastAPI(title="Pokémon Team Analyzer API")

class PokemonSchema(BaseModel):
    pokemonName: str
    pokedexNumber: int

class TeamAnalysisRequest(BaseModel):
    pokemons: List[PokemonSchema]

TYPE_CACHE = {}

async def get_type_relations(type_name: str, client: httpx.AsyncClient) -> dict:
    if type_name in TYPE_CACHE:
        return TYPE_CACHE[type_name]
    
    url = f"https://pokeapi.co/api/v2/type/{type_name.lower()}"
    response = await client.get(url)
    
    if response.status_code != 200:
        return {}
    
    data = response.json()
    damage_relations = data["damage_relations"]
    
    relations = {
        "double_damage_from": [t["name"] for t in damage_relations["double_damage_from"]],
        "half_damage_from": [t["name"] for t in damage_relations["half_damage_from"]],
        "no_damage_from": [t["name"] for t in damage_relations["no_damage_from"]],
    }
    
    TYPE_CACHE[type_name] = relations
    return relations

async def get_pokemon_types(pokemon_name: str, client: httpx.AsyncClient) -> List[str]:
    url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_name.lower()}"
    response = await client.get(url)
    if response.status_code != 200:
        return []
    
    data = response.json()
    return [t["type"]["name"] for t in data["types"]]

@app.post("/analyze-team")
async def analyze_team(payload: TeamAnalysisRequest):
    if not payload.pokemons:
        raise HTTPException(status_code=400, detail="O time deve conter pelo menos 1 Pokémon.")

    team_weaknesses: Dict[str, int] = {}
    team_resistances: Dict[str, int] = {}

    async with httpx.AsyncClient() as client:
        type_tasks = [get_pokemon_types(p.pokemonName, client) for p in payload.pokemons]
        pokemons_types_list = await asyncio.gather(*type_tasks)

        for pokemon_types in pokemons_types_list:
            type_multipliers = {}
            for p_type in pokemon_types:
                relations = await get_type_relations(p_type, client)
                for x in relations.get("double_damage_from", []):
                    type_multipliers[x] = type_multipliers.get(x, 1.0) * 2.0
                for x in relations.get("half_damage_from", []):
                    type_multipliers[x] = type_multipliers.get(x, 1.0) * 0.5
                for x in relations.get("no_damage_from", []):
                    type_multipliers[x] = type_multipliers.get(x, 1.0) * 0.0

            for attack_type, mult in type_multipliers.items():
                if mult > 1.0:
                    team_weaknesses[attack_type] = team_weaknesses.get(attack_type, 0) + 1
                elif mult < 1.0:
                    team_resistances[attack_type] = team_resistances.get(attack_type, 0) + 1

    return {
        "total_pokemons": len(payload.pokemons),
        "team_weaknesses": team_weaknesses,
        "team_resistances": team_resistances,
        "vulnerabilities": [t for t, count in team_weaknesses.items() if count >= 3]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)