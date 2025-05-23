// unequip
// remove an item from the user's equipped items
import { processWearableLocation, WEARABLE_LOCATION_VALUES, } from "../constants/WEARABLE_LOCATION.js";
import calculateAffixBonuses from "../util/calculateAffixBonuses.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
async function unequip(parsedCommand, user, item, location) {
    try {
        // handle a direct server call (e.g. from within another command like EQUIP) with item and location already confirmed
        if (item && location) {
            // console.log(
            //   `unequip called (server direct) with item ${item.name} and location ${location}`
            // );
            removeItemFromSlot(user, item, location);
            calculateAffixBonuses(user);
            return;
        }
        // handle a call with parsedCommand from the user
        // console.log(
        //   `unequip called (user command) with parsedCommand ${JSON.stringify(
        //     parsedCommand
        //   )}`
        // );
        let requestedItemKeyword = parsedCommand.directObject;
        if (!requestedItemKeyword) {
            messageToUsername(user.username, `Unequip what? Read HELP UNEQUIP for more info.`, `rejection`);
            return;
        }
        // process a specified location keyword (e.g. "unequip sword hand")
        let processedLocation;
        if (parsedCommand.indirectObject) {
            processedLocation = processWearableLocation(parsedCommand.indirectObject);
        }
        // handle a specified location
        if (processedLocation) {
            // console.log(
            //   `unequip called (user command) with processedLocation ${processedLocation}`
            // );
            let itemInSlot = user.equipped[processedLocation];
            // handle location already empty
            if (!itemInSlot) {
                // console.log(`item not found in location!`);
                messageToUsername(user.username, `You've nothing equipped for your ${processedLocation}.`, `rejection`);
                return;
            }
            // console.log(`item found in location! ${itemInSlot.name}`);
            if (!itemInSlot.keywords.some((k) => requestedItemKeyword.startsWith(k))) {
                //handle item in slot not matching requested keyword
                messageToUsername(user.username, `You have ${itemInSlot.name} on your ${processedLocation}.`, `rejection`);
                messageToUsername(user.username, `Try UNEQUIP ${itemInSlot.keywords[0]} ${processedLocation}.`, `rejection`);
                return;
            }
            removeItemFromSlot(user, itemInSlot, processedLocation);
            calculateAffixBonuses(user);
            return;
        }
        // console.log(`no location specified.`);
        // Search through all equipped slots for matching item
        let itemInSlot = null;
        for (const l of [...WEARABLE_LOCATION_VALUES, "weapon1", "weapon2"]) {
            itemInSlot = user.equipped[l];
            if (itemInSlot) {
                if (itemInSlot.keywords.some((k) => k.startsWith(requestedItemKeyword))) {
                    removeItemFromSlot(user, itemInSlot, l);
                    calculateAffixBonuses(user);
                    return;
                }
            }
        }
        // If no match found, inform user
        if (!itemInSlot) {
            messageToUsername(user.username, `There's no ${requestedItemKeyword} to unequip.`, `rejection`);
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`unequip`, error, user?.name);
    }
}
function removeItemFromSlot(user, item, location) {
    user.inventory.push(item);
    user.equipped[location] = null;
    messageToUsername(user.username, `You unequip ${item.name}.`, `itemIsHere`);
    // console.log(
    //   `${user.name}'s ${location} now holds ${
    //     user.equipped[location as keyof IUser["equipped"]]
    //   }`
    // );
}
export default unequip;
