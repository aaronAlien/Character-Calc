import React from "react";
import { getFarmableToday } from "../lib/farmable/getFarmableToday";
import { characters } from "../data/characters";
import { getCurrentDay } from "../lib/utils/getCurrentDay";
import { Link } from "react-router-dom";
import Tooltip from "./toolTip";

export default function FarmableToday() {
  const day = getCurrentDay();
  const rows = getFarmableToday(characters, day);

  return (
    <div className='md:max-w-xl w-full border rounded-xl border-white/10 bg-zinc-900/85 p-4'>
      <h2 className='text-white text-xl mb-3'>Available Today</h2>

      {day === "sunday" ? (
        <p className='text-zinc-300'>All domains are open today.</p>
      ) : (
        <table className='w-full'>
          <tbody>
            {rows.map(({ material, characters }) => (
              <tr key={material.id} className='border-b border-zinc-700'>
                {/* MATERIAL */}
                <td className='py-1 w-14'>
                  <Tooltip title={material.name}>
                    <img
                      src={`/images/items/${material.id}.png`}
                      alt={material.name}
                      className='w-12 h-12'
                    />
                  </Tooltip>
                </td>

                {/* CHARACTERS */}
                <td className='py-2'>
                  {characters.map((char) => (
                    <Link
                      key={char.id}
                      to={`/characters/${char.id}`}
                      className='inline-block'
                    >
                      <Tooltip title={char.name}>
                        <img
                          src={`/images/characters/portrait/${char.id}.png`}
                          alt={char.name}
                          className='inline-block w-10 h-10 rounded-full mr-2 hover:scale-105 transition-transform'
                        />
                      </Tooltip>
                    </Link>
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
