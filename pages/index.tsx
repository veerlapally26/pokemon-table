import { GetServerSideProps } from "next";
import axios from "axios";
import PokemonTable from "@/components/PokemonTable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";

interface Pokemon {
  name: string;
  url: string;
  sprites?: {
    front_default: string;
  };
  types?: Array<{
    type: {
      name: string;
    };
  }>;
  height?: number;
  weight?: number;
  base_experience?: number;
}

interface Props {
  pokemons: Pokemon[];
  query: string;
  page: number;
  error?: string;
}

export default function Home({ pokemons, query, page, error }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(query);

  useEffect(() => {
    const handler = debounce((value: string) => {
      if (value) {
        router.push(`/?query=${value}`);
      } else {
        router.push(`/?page=0`);
      }
    }, 500);

    handler(search);
    return () => handler.cancel();
  }, [search]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Pokémon List</h1>
      <div className="mb-4 text-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name"
          className="px-3 py-2 border rounded shadow-sm"
        />
      </div>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          <PokemonTable pokemons={pokemons} />
          {!query && (
            <div className="flex justify-center mt-4 gap-4">
              <a
                href={`/?page=${Math.max(page - 1, 0)}`}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Prev
              </a>
              <a
                href={`/?page=${page + 1}`}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Next
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const search = query.query as string || "";
  const page = parseInt(query.page as string) || 0;
  const limit = 20;
  const offset = page * limit;

  if (search) {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
      return {
        props: {
          pokemons: [{ 
            name: res.data.name,
            url: `https://pokeapi.co/api/v2/pokemon/${res.data.name}`,
            base_experience: res.data.base_experience,
            types: res.data.types,
            sprites: res.data.sprites
          }],
          query: search,
          page,
        },
      };
    } catch {
      return {
        props: {
          pokemons: [],
          query: search,
          page,
          error: "Pokémon not found.",
        },
      };
    }
  } else {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    // Fetch detailed data for each Pokemon
    const detailedPokemon = await Promise.all(
      res.data.results.map(async (pokemon: any, index: number) => {
        const detailResponse = await fetch(pokemon.url);
        const detailData = await detailResponse.json();
        return {
          ...detailData,
          id: offset + index + 1,
          url: pokemon.url,
        };
      })
    );
    return {
      props: {
        pokemons: detailedPokemon,
        query: "",
        page,
      },
    };
  }
};