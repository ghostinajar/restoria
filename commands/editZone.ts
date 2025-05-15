// editZone
// allows user to edit zone details
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import truncateDescription from "../util/truncateDescription.js";
import { IZoneData } from "./createZone.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import Name from "../model/classes/Name.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import putNumberInRange from "../util/putNumberInRange.js";

async function editZone(zoneData: IZoneData, user: IUser) {
  try {
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }
    if (user._id.toString() !== zone.author.toString()) {
      worldEmitter.emit(`messageFor${user.username}`, makeMessage(
        `rejection`, `Tsk, you aren't an author of this zone. GOTO one of your own and EDIT there.`
      ))
      return;
    }

    truncateDescription(zoneData.description, user);

    zone.history.modifiedDate = new Date();

    if (zoneData.name !== zone.name) {
      // check updated zone name for duplicate in Names
      let nameIsTaken = await Name.findOne({
        name: zoneData.name.toLowerCase(),
      });
      if (nameIsTaken) {
        const message = makeMessage(`rejection`, `That zone name is taken.`);
        worldEmitter.emit(`messageFor${user.username}`, message);
        return;
      }

      // erase (unreserver) old name from Names
      await Name.deleteOne({name: zone.name.toLowerCase()});

      // Register new name to Names
      const nameToRegister = new Name({ name: zoneData.name.toLowerCase() });
      const nameSaved = await nameToRegister.save();
      if (!nameSaved) {
        logger.error(
          `editZone couldn't save the name ${zoneData.name} to Names!`
        );
        makeMessage(
          `rejected`,
          `Sorry, we ran into a problem saving your zone changes!`
        );
        return;
      }
      logger.info(`User ${user.name} renamed a zone, ${zone.name} unreserved in Names. Reserving ${zoneData.name}...`)
      zone.name = zoneData.name;
    }

    zone.minutesToReconstruct = putNumberInRange(
      5,
      180,
      zoneData.minutesToReconstruct,
      user
    );
    zone.description = zoneData.description;

    await zone.save();
    await zone.initRooms();
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`success`, `Zone changes saved!`)
    );
    return;
  } catch (error: unknown) {
    catchErrorHandlerForFunction("editZone", error, user.name);
  }
}

export default editZone;
