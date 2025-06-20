// combatTargetIsInRoom
// returns true if mob or user is present in a given room

import { IRoom } from "../model/classes/Room.js";
import ICombatTarget from "../types/CombatTarget.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function combatTargetIsInRoom(room: IRoom, combatTarget: ICombatTarget) {
  try {
    // For user targets
    if (combatTarget.type === "user") {
      const userInRoom = room.users.find(
        (u) => u._id.toString() === combatTarget.id.toString()
      );
      if (userInRoom && !userInRoom.fainted) {
        return true;
      }
    }

    // For mob targets
    if (combatTarget.type === "mob") {
      const mobInRoom = room.mobs.find(
        (m) => m._id.toString() === combatTarget.id.toString()
      );
      if (mobInRoom) {
        return true;
      }
    }
    return false;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`combatTargetIsInRoom`, error);
    return false;
  }
}

export default combatTargetIsInRoom;
