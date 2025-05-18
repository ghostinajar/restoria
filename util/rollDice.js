// rollDice
// accepts D&D dice syntax (e.g. 4d8) to return a random number
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function rollDice(rollParams) {
    try {
        // Validate input format using regex
        const diceRegex = /^-?(\d+)d(\d+)$/;
        const match = rollParams.toLowerCase().match(diceRegex);
        if (!match) {
            throw new Error(`Invalid dice notation. Expected format: NdX (e.g. 3d8)`);
        }
        let numberOfDice = Math.abs(parseInt(match[1]));
        let diceSides = parseInt(match[2]);
        // Clamp values to reasonable limits
        const MIN_DICE = 1;
        const MAX_DICE = 100;
        const MIN_SIDES = 2;
        const MAX_SIDES = 100;
        if (numberOfDice < MIN_DICE || numberOfDice > MAX_DICE) {
            catchErrorHandlerForFunction('rollDice', new Error(`Number of dice (${numberOfDice}) clamped to range ${MIN_DICE}-${MAX_DICE}`));
            numberOfDice = Math.max(MIN_DICE, Math.min(numberOfDice, MAX_DICE));
        }
        if (diceSides < MIN_SIDES || diceSides > MAX_SIDES) {
            catchErrorHandlerForFunction('rollDice', new Error(`Number of sides (${diceSides}) clamped to range ${MIN_SIDES}-${MAX_SIDES}`));
            diceSides = Math.max(MIN_SIDES, Math.min(diceSides, MAX_SIDES));
        }
        // Roll the dice and sum the results
        let total = 0;
        for (let i = 0; i < numberOfDice; i++) {
            total += Math.floor(Math.random() * diceSides) + 1;
        }
        return total;
    }
    catch (error) {
        catchErrorHandlerForFunction(`rollDice`, error);
    }
}
export default rollDice;
