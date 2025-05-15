// attack
// user command to attack a target
import Action from "../model/classes/Action.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findMobInRoom from "../util/findMobinRoom.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import messageToUsername from "../util/messageToUsername.js";
import sendHudUpdateToUser from "../util/sendHudUpdateToUser.js";
async function attack(parsedCommand, user) {
    try {
        if (!parsedCommand.directObject) {
            messageToUsername(user.username, `Attack what?`, `rejection`, true);
            return;
        }
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Couldn't find room for ${user.name}`);
        }
        if (room?.noCombat) {
            messageToUsername(user.username, `Combat isn't allowed in this room.`, `rejection`, true);
            return;
        }
        // fail if target not in room.mobs
        const target = findMobInRoom(room, parsedCommand.directObject, parsedCommand.directObjectOrdinal);
        if (!target) {
            messageToUsername(user.username, `You couldn't find any ${parsedCommand.directObject} to attack.`, `rejection`);
            return;
        }
        user.combatTargetId = target._id;
        user.combatTargetName = target.name;
        sendHudUpdateToUser(user);
        if (user.readyForAttack) {
            const attackAction = new Action(user._id, "mob", target._id, target.keywords[0], "attack");
            // TODO await resolveAction(attackAction) when implemented
            user.readyForAttack = false;
            return;
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`attack`, error, user?.name);
    }
}
export default attack;
