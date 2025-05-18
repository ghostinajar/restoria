// attackHandler
// resolveAction handler for attack
import catchErrorHandlerForFunction from "../catchErrorHandlerForFunction.js";
async function attackHandler(attacker, defender) {
    try {
        // determine hitSucceeds: boolean (roll20+HB vs AC)
        let hitSucceeds = false;
        // const roll = ( rollDice() => defender.armorClass)
        // if successful dodge or parry roll, override hitSucceeds to false
        // if !hitSucceeds, message users in room, return
        // if defender has mirror images, expend one, message users in room, return
        // calculate grossDamage (roll attacker weapon dice + DB)
        // calculate netDamage (subtract defender resistances, spirit armor, protect)
        // reduce defender's currentHealth
        // if thorns, reduce attacker's currentHealth by netDamage / 2
    }
    catch (error) {
        catchErrorHandlerForFunction(`attackHandler`, error);
    }
}
export default attackHandler;
