import React from "react";
import { getFarmableToday } from "../../logic/farmable/getFarmableToday";
import { characters } from "../../data/characters";
import { getCurrentDay } from "../../logic/getCurrentDay";
import Tooltip from "../ui/toolTip";

export default function FarmableToday() {
  const day = getCurrentDay();
  const rows = getFarmableToday(characters, day);

return (
  <div className="bg-zinc-800 rounded-xl p-4">
    <h2 className="text-white mb-3">Farmable Today</h2>

    {day === "sunday" ? (
      <p className="text-zinc-300">All domains are open today.</p>
    ) : (
      <table className="w-full">
        <tbody>
          {rows.map(({ material, characters }) => (
            <tr key={material.id} className="border-b border-zinc-700">
              
              {/* MATERIAL */}
              <td className="py-2 w-14">
                <Tooltip title={material.name}>
                  <img
                    src={`/static/images/items/${material.id}.png`}
                    alt={material.name}
                    className="w-12 h-12"
                  />
                </Tooltip>
              </td>

              {/* CHARACTERS */}
              <td className="py-2">
                {characters.map((char) => (
                  <Tooltip key={char.id} title={char.name}>
                    <img
                      src={`/static/images/characters/portrait/${char.id}.png`}
                      alt={char.name}
                      className="inline-block w-10 h-10 rounded-full mr-2"
                    />
                  </Tooltip>
                ))}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
}
