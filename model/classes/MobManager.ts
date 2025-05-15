// MobManager
// Manages all loading and destroying of active mob instances in game
import logger from "../../logger.js";
import worldEmitter from "./WorldEmitter.js";
import Mob, { IMob } from "./Mob.js";
import { IMobBlueprint } from "./MobBlueprint.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";
import mongoose from "mongoose";
import { ILocation } from "./Location.js";

class MobManager {
  constructor() {
    this.mobs = new Map(); // Stores all mobs with their _id.toString() as key
    worldEmitter.on("mobRequestedById", this.mobRequestedByIdHandler);
    worldEmitter.on("roomDestroyingMob", this.roomDestroyingMobHandler);
    worldEmitter.on("roomRequestingNewMob", this.roomRequestingNewMobHandler);
  }

  mobs: Map<string, IMob> | null;

  mobRequestedByIdHandler = async (id: mongoose.Types.ObjectId) => {
    try {
        worldEmitter.emit(
          `mobManagerReturningMob${id.toString()}`,
          this.mobs?.get(id.toString())
        );
    } catch (error: unknown) {
      catchErrorHandlerForFunction("mobRequestedByIdHandler", error);
    }
  };

  roomRequestingNewMobHandler = async (blueprint: IMobBlueprint, location: ILocation) => {
    try {
      if (!this.mobs) {
        logger.warn(
          "MobManager 'mobs' map is null when attempting to add a new mob."
        );
        return null;
      }
      if (!blueprint || !blueprint._id) {
        logger.error(
          "Invalid blueprint provided to roomRequestingNewMobHandler."
        );
        return null;
      }
      // Create a copy of the blueprint and give its own unique Id
      const mob = new Mob(blueprint, location);
      this.mobs.set(mob._id.toString(), mob);
      worldEmitter.emit(`mobManagerAddedMobFromBlueprint${blueprint._id}`, mob);
    } catch (error: unknown) {
      catchErrorHandlerForFunction("roomRequestingNewMobHandler", error);
    }
  };

  roomDestroyingMobHandler = async (mobId: string) => {
    try {
      if (!mobId) {
        logger.warn("roomDestroyingMobHandler called with invalid mobId.");
        return;
      }
      await this.removeMobById(mobId);
      worldEmitter.emit(`mobManagerRemovedMob${mobId}`);
    } catch (error: unknown) {
      catchErrorHandlerForFunction("roomDestroyingMobHandler", error);
    }
  };

  async getMobById(id: string) {
    try {
      if (!this.mobs) {
        logger.warn("MobManager attempted to get mob from null 'mobs' map.");
        return null;
      }
      const mob = this.mobs.get(id.toString());
      if (mob) {
        return mob;
      } else {
        logger.error(`mobManager can't find mob with id: ${id}.`);
        return null;
      }
    } catch (error: unknown) {
      catchErrorHandlerForFunction("roomDestroyingMobHandler", error);
    }
  }

  async removeMobById(id: string) {
    try {
      if (!this.mobs) {
        logger.warn("MobManager attempted to remove mob from null 'mobs' map.");
        return null;
      }
      if (this.mobs.has(id)) {
        this.mobs.delete(id);
        logger.info(`MobManager removed mob with id "${id}".`);
      } else {
        logger.warn(`MobManager: mob with id "${id}" does not exist.`);
      }
    } catch (err: any) {
      logger.error(`Error in removeMobById: ${err.message}`);
      throw err;
    }
  }

  clearContents() {
    logger.info("MobManager clearing all mobs and event listeners.");
    this.mobs = null;
    worldEmitter.off("mobRequestedById", this.mobRequestedByIdHandler);
    worldEmitter.off("roomDestroyingMob", this.roomDestroyingMobHandler);
    worldEmitter.off("roomRequestingNewMob", this.roomRequestingNewMobHandler);
  }
}

export default MobManager;
