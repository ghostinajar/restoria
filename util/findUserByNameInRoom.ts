// findUserByNameInRoom
// utility function to find IMob object by keyword and ordinal in a given room

import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function findUserByNameInRoom(
  room: IRoom,
  targetName: string
): IUser | undefined {
  try {
    const user = room.users.find((user) =>
      user.username.startsWith(targetName)
    );
    return user;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`findUserByNameInRoom`, error);
  }
}

export default findUserByNameInRoom;
