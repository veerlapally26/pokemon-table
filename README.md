Server Side Rendered Pokémon Table App

This is a SSR Next.js app that displays a paginated, filterable, and sortable table of Pokémon using data from the [PokéAPI](https://pokeapi.co/).

The app is built with:

  **Next.js (SSR)**
  **TypeScript**
  **TanStack Table v8** (sorting, table layout)
  **Tailwind CSS**
  **Axios** for fetching data
  **Lodash.debounce** for Filtering

---

Features

- Server-side data fetching via `getServerSideProps`
- Debounced search by Pokémon name (`api/v2/pokemon/{name}`)
- Pagination (`?page=0`, `?page=1`, etc.)
- Client-side sorting by name (TanStack Table)
- Click a row to open a modal with Pokémon details
- Second table inside modal showing evolution triggers (with pagination)

---

Installation

git clone <repo-url>
cd pokemon-table-app
npm install
