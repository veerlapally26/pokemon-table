import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  name: string;
  onClose: () => void;
}

export default function PokemonModal({ name, onClose }: Props) {
  const [data, setData] = useState<any>(null);
  const [triggers, setTriggers] = useState<any[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => {
      setData(res.data);
    });
    axios
      .get(`https://pokeapi.co/api/v2/evolution-trigger?offset=${page * 5}&limit=5`)
      .then(res => {
        setTriggers(res.data.results);
      });
  }, [name, page]);

  if (!data) return null;

  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <Dialog.Title className="text-2xl font-bold mb-2">{data.name}</Dialog.Title>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="font-semibold">{data.height ? (data.height / 10).toFixed(1) : 'N/A'} m</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="font-semibold">{data.weight ? (data.weight / 10).toFixed(1) : 'N/A'} kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Base Experience</p>
              <p className="font-semibold">{data.base_experience || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Abilities</p>
              <div className="space-y-1">
                {data.abilities?.slice(0, 2).map((ability) => (
                  <p key={ability.ability.name} className="font-semibold">
                    {ability.ability.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <br/><br/>
          <h2 className="text-lg font-semibold">Evolution Triggers</h2>
          <table className="w-full mt-2 border">
            <thead>
              <tr>
                <th className="text-center p-1 border">Id</th>
                <th className="text-center p-1 border">Name</th>
              </tr>
            </thead>
            <tbody>
              {triggers.map(trigger => (
                <tr key={trigger.name}>
                  <td className="text-center p-1 border">{trigger.url.split('/').filter(Boolean).pop()}</td>
                  <td className="text-center p-1 border">{trigger.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setPage(p => Math.max(p - 1, 0))}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}