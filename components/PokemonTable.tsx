import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import PokemonModal from "./PokemonModal";

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
}

export default function PokemonTable({ pokemons }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Pokemon>[] = [
    {
      header: () => "Poke Name",
      accessorKey: "name",
    },
    {
      header: () => "Appearence",
      accessorKey: "sprites",
      cell: (rowInfo) => {
        return (
          <span>
            <img
              src={rowInfo.row.original.sprites?.front_default}
              alt={rowInfo.row.original.name}
              className="w-24 h-24"
            />
          </span>
        )
      },
    },
    {
      header: () => "Poke Type",
      accessorKey: "types",
      cell: (rowInfo) => {
        return (
          <span>
           {rowInfo.row.original.types?.map(pokeType => (<span>{pokeType.type.name}<br/></span>))}
          </span>
        )
      },
    },
    {
      header: () => "Base Experience",
      accessorKey: "base_experience",
    }
  ];

  const table = useReactTable({
    data: pokemons,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border border-gray-200 shadow-lg rounded-lg">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  className="p-3 text-left cursor-pointer select-none"
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " ↑",
                    desc: " ↓",
                  }[header.column.getIsSorted() as string] ?? ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => setSelected(row.original.name)}
            >
              {row.getVisibleCells().map(cell => (
                <td className="p-3" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <PokemonModal name={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}