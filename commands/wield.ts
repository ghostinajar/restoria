// wield
// // user can WEILD a weapon-type item in their WEAPON1

import { IItem } from "../model/classes/Item.js";
import { IUser } from "../model/classes/User.js";
import calculateAffixBonuses from "../util/calculateAffixBonuses.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import save from "./save.js";
import unequip from "./unequip.js";
import { moveItemToEquippedOnUser } from "./wear.js";

async function wield(item: IItem, user: IUser) {
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
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`wield`, error, user?.name);
  }
}

export default wield;
