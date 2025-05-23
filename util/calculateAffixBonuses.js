// calculateAffixBonuses
// gather all affixes from equipped items and total the bonuses
import { AFFIX_BONUSES } from "../constants/AFFIX_BONUSES.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import getEquippedItems from "./getEquippedItems.js";
function calculateAffixBonuses(agent) {
    try {
        const bonuses = { ...AFFIX_BONUSES };
        const equippedItems = getEquippedItems(agent);
        // Sum up all affix values from equipped items
        for (const item of equippedItems) {
            if (item.affixes) {
                for (const affix of item.affixes) {
                    const affixType = affix.affixType;
                    if (affixType in bonuses) {
                        bonuses[affixType] += affix.value;
                    }
                }
            }
        }
        // Include affix bonuses on agent itself
        console.log(`calculating affix bonuses for ${agent.name}`);
        console.log(`agent.affixes:`);
        console.log(agent.affixes);
        agent.affixes.forEach((affix) => {
            const affixType = affix.affixType;
            if (affixType in bonuses) {
                bonuses[affixType] += affix.value;
            }
        });
        agent.affixBonuses = bonuses;
    }
    catch (error) {
        catchErrorHandlerForFunction(`calculateAffixBonuses`, error);
        return { ...AFFIX_BONUSES };
    }
}
export default calculateAffixBonuses;
