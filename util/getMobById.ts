// getMobById
// returns a mob object if it still exists in MobManager, else undefined

import mongoose from "mongoose";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IMob } from "../model/classes/Mob.js";

async function getMobById(id: mongoose.Types.ObjectId) {
  try {
    const mob: IMob = await new Promise((resolve) => {
      worldEmitter.once(`mobManagerReturningMob${id.toString()}`, resolve);
      worldEmitter.emit("mobRequestedById", id);
    });
    return mob;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`getMobById`, error);
  }
}

export default getMobById;
