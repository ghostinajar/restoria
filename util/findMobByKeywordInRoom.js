// findMobByKeywordInRoom
// utility function to find IMob object by keyword and ordinal in a given room
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function findMobByKeywordInRoom(room, mobKeyword, mobOrdinal) {
    try {
        // find eligible matches
        const filteredInventory = room.mobs.filter((mob) => mob.keywords.some((keyword) => keyword.toLowerCase().startsWith(mobKeyword)));
        let foundMob;
        if (mobOrdinal) {
            // Check if the requested ordinal exists in the filtered inventory
            foundMob =
                mobOrdinal < filteredInventory.length
                    ? filteredInventory[mobOrdinal]
                    : undefined;
        }
        else {
            // If no ordinal specified, return first match if any
            foundMob = filteredInventory[0];
        }
        return foundMob;
    }
    catch (error) {
        catchErrorHandlerForFunction(`findMobInRoom`, error);
    }
}
export default findMobByKeywordInRoom;
