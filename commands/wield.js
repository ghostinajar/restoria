// wield
// // user can WEILD a weapon-type item in their WEAPON1
import calculateAffixBonuses from "../util/calculateAffixBonuses.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import save from "./save.js";
import unequip from "./unequip.js";
import { moveItemToEquippedOnUser } from "./wear.js";
async function wield(item, user) {
    try {
        // handle item currently equipped item in weapon1 slot
        const itemInSlot = user.equipped["weapon1"];
        if (itemInSlot) {
            unequip({ commandWord: "unequip" }, user, itemInSlot, "weapon1");
        }
        // equip item and save
        moveItemToEquippedOnUser(user, item, "weapon1");
        calculateAffixBonuses(user);
        await save(user, true);
    }
    catch (error) {
        catchErrorHandlerForFunction(`wield`, error, user?.name);
    }
}
export default wield;
