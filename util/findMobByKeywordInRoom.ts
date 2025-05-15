// findMobByKeywordInRoom
// utility function to find IMob object by keyword and ordinal in a given room

import { IMob } from "../model/classes/Mob.js";
import { IRoom } from "../model/classes/Room.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function findMobByKeywordInRoom(
  room: IRoom,
  mobKeyword: string,
  mobOrdinal?: number | undefined
): IMob | undefined {
  try {
    // find eligible matches
    const filteredInventory = room.mobs.filter((mob) =>
      mob.keywords.some((keyword) =>
        keyword.toLowerCase().startsWith(mobKeyword)
      )
    );

    let foundMob: IMob | undefined;

    if (mobOrdinal) {
      // Check if the requested ordinal exists in the filtered inventory
      foundMob =
        mobOrdinal < filteredInventory.length
          ? filteredInventory[mobOrdinal]
          : undefined;
    } else {
      // If no ordinal specified, return first match if any
      foundMob = filteredInventory[0];
    }

    return foundMob;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`findMobInRoom`, error);
  }
}

export default findMobByKeywordInRoom;
