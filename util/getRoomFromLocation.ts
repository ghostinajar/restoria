// getRoomFromLocation
// takes an ILocation object (room + zone ids) and returns the active room with those ids

import { ILocation } from "../model/classes/Location.js";
import { IRoom } from "../model/classes/Room.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function getRoomFromLocation(location: ILocation) {
  try {
    const room: IRoom = await new Promise((resolve) => {
      worldEmitter.once(
        `zoneManagerReturningRoom${location.inRoom.toString()}`,
        resolve
      );
      worldEmitter.emit("roomRequested", location);
    });
    if (!room) {
      throw new Error(`room for location R: ${location.inRoom} Z: ${location.inZone} not found!`)
    }
    return room;
  } catch (error: unknown) {
    catchErrorHandlerForFunction("getRoomFromLocation", error);
  }
}

export default getRoomFromLocation;
