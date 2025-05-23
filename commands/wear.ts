// wear
// user can WEAR an armor-type item to an appropriate slot

import {
  processWearableLocation,
  WEARABLE_LOCATION_VALUES,
} from "../constants/WEARABLE_LOCATION.js";
import { IItem } from "../model/classes/Item.js";
import { IUser } from "../model/classes/User.js";
import IEquipped from "../types/Equipped.js";
import calculateAffixBonuses from "../util/calculateAffixBonuses.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
import save from "./save.js";
import unequip from "./unequip.js";

async function wear(item: IItem, user: IUser, location?: string) {
  try {
    // Fail if armor has no wearable locations
    if (
      !item.wearableLocations ||
      !Object.values(item.wearableLocations).some(Boolean)
    ) {
      messageToUsername(
        user.username,
        `The author of ${item.name} needs to add wearable locations.`,
        `rejection`
      );
      return;
    }

    // make an array and push the keys of the item.wearableLocations object into it if the value of that key is true
    const locationsItemIsWearable: string[] = item.wearableLocations
      ? Object.keys(item.wearableLocations).filter(
          (l) =>
            (item.wearableLocations ?? {})[
              l as keyof IItem["wearableLocations"]
            ]
        )
      : [];

    // console.log(`item is wearable! locations:`);
    // console.log(locationsItemIsWearable);

    // Fail if indirect object is provided in parsedCommand but isn't a valid wearable location
    let requestedLocation = processWearableLocation(location);
    if (location && !requestedLocation) {
      messageToUsername(
        user.username,
        `${location} isn't a place you can wear something.`,
        `help`
      );
      messageToUsername(
        user.username,
        `Read HELP EQUIP to find out more.`,
        `rejection`
      );
      return;
    }

    // if (requestedLocation) {
    //   console.log(`indirect object is valid!`);
    //   console.log(`specified location (expanded): ${requestedLocation}`);
    // }

    // Fail if user provided a valid location, but the item doesn't fit there
    if (
      requestedLocation &&
      !locationsItemIsWearable.some(
        (location) => location === requestedLocation
      )
    ) {
      messageToUsername(
        user.username,
        `You can't fit ${item.name} on your ${
          requestedLocation === "finger1" || requestedLocation === "finger2"
            ? "finger"
            : requestedLocation
        }.`,
        `rejection`
      );
      messageToUsername(
        user.username,
        `Try your ${locationsItemIsWearable[0]}, or WEAR ${item.keywords[0].toUpperCase()} on its own.`,
        `rejection`
      );
      return;
    }

    // for each property in user.equipped, if the value is null (nothing is worn there), push the key into locationsUserHasEmpty as a string
    const locationsUserHasEmpty: string[] = WEARABLE_LOCATION_VALUES.filter(
      (l) => !user.equipped[l as keyof IEquipped]
    );
    // console.log(`user has empty locations:`);
    // console.log(locationsUserHasEmpty);

    // if the user has specified an empty location, go ahead and equip the item there
    if (
      requestedLocation &&
      locationsUserHasEmpty.includes(requestedLocation)
    ) {
      moveItemToEquippedOnUser(user, item, requestedLocation);
      calculateAffixBonuses(user);
      return;
    }

    // make a list of slots that are both empty and compatible
    const compatibleAndEmptyLocationsOnUser: string[] =
      locationsUserHasEmpty.filter((l) => locationsItemIsWearable.includes(l));
    // console.log(`user has empty and compatible locations:`);
    // console.log(compatibleAndEmptyLocationsOnUser);

    // if an empty && compatible slot exists, equip the item there
    if (compatibleAndEmptyLocationsOnUser.length > 0) {
      requestedLocation = compatibleAndEmptyLocationsOnUser[0];
      // console.log(
      //   `user wanted ${item.name} on empty ${requestedLocation}, equipping...`
      // );
      moveItemToEquippedOnUser(user, item, requestedLocation);
      calculateAffixBonuses(user);
      return;
    }

    // at this point we've handled empty slots (either specified or not)
    // now we handle slots that are already occupied by items
    let locationToTry = requestedLocation || locationsItemIsWearable[0];
    // console.log(`user wants ${item.name} on occupied ${locationToTry} slot...`);
    if (!locationToTry) {
      throw new Error(`Couldn't find locationToTry for ${item.name}.`);
    }

    const itemInSlot = user.equipped[locationToTry as keyof IEquipped];
    if (!itemInSlot) {
      throw new Error(`Couldn't find itemInSlot for ${user.name}.`);
    }

    // console.log(
    //   `item in slot: ${itemInSlot?.name} (${itemInSlot?._id}), unequipping...`
    // );
    unequip({ commandWord: "unequip" }, user, itemInSlot, locationToTry);
    moveItemToEquippedOnUser(user, item, locationToTry);
    calculateAffixBonuses(user);
    await save(user, true);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`wear`, error, user?.name);
  }
}

// moves an item from inventory to an empty slot on character.equipped
export function moveItemToEquippedOnUser(user: IUser, item: IItem, location: string) {
  user.equipped[location as keyof IEquipped] = item;
  user.inventory = user.inventory.filter((i) => i._id !== item._id);
  messageToUsername(user.username, `You equip ${item.name}.`, `itemIsHere`);
  // console.log(
  //   `${user.name}'s ${location} now holds ${
  //     user.equipped[location as keyof IEquipped]?.name
  //   } (${item._id})`
  // );
}

export default wear;
