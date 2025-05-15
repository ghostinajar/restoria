// activateMobNodes
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import activateItemNodes from "./activateItemNodes.js";
import { IMobNode } from "../model/classes/MobNode.js";
import { IMob } from "../model/classes/Mob.js";
import { IMobBlueprint } from "../model/classes/MobBlueprint.js";
import { IZone } from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import { ILocation } from "../model/classes/Location.js";

async function activateMobNodes(
  mobNodes: Array<IMobNode>,
  mobArray: Array<IMob>,
  location: ILocation
) {
  try {
    for (const mobNode of mobNodes) {
      try {
        const zone: IZone = await new Promise((resolve) => {
          worldEmitter.once(
            `zone${mobNode.fromZoneId.toString()}Loaded`,
            resolve
          );
          worldEmitter.emit(`zoneRequested`, mobNode.fromZoneId.toString());
        });
        if (!zone) {
          logger.error(`activateMobNodes couldn't get a zone`);
          return null;
        }

        const blueprint = zone.mobBlueprints.find(
          (blueprint: IMobBlueprint) =>
            blueprint._id.toString() === mobNode.loadsBlueprintId.toString()
        );
        if (!blueprint) {
          logger.error(
            `activateMobNodes couldn't find blueprint ${mobNode.loadsBlueprintId} in zone ${zone.name}.`
          );
          return null;
        }

        const mob: IMob = await new Promise((resolve) => {
          worldEmitter.once(
            `mobManagerAddedMobFromBlueprint${blueprint._id}`,
            resolve
          );
          worldEmitter.emit(`roomRequestingNewMob`, blueprint, location);
        });
        //TODO initiate mob inventory
        mob.inventory = [];
        await activateItemNodes(blueprint.itemNodes, mob.inventory);
        //logger.debug(`Items in mob "${mob.name}": ${mob.inventory.map(item => item.name)}`)
        mobArray.push(mob);
      } catch (err: any) {
        logger.error(
          `Error in activateMobNodes with a mobNode: ${err.message}`
        );
        throw err;
      }
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction("activateMobNodes", error);
  }
}

export default activateMobNodes;
