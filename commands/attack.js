// attack
// user command to attack a target
import Action from "../model/classes/Action.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findMobInRoom from "../util/findMobinRoom.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import messageToUsername from "../util/messageToUsername.js";
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
        // TODO message user.combatTargetName to client for HUD
        console.log(`TODO message user.combatTargetName to client for HUD`);
        // package attackAction : IAction object
        const attackAction = new Action(user, "mob", target._id, "attack");
        // if user.readyForAttack, execute attackAction now, return
        console.log(user.readyForAttack);
        if (user.readyForAttack) {
            // TODO executeAction(attackAction) when implemented
            console.log(`TODO executeAction(attackAction) when implemented`);
            console.log(attackAction);
            user.readyForAttack = false;
            return;
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`attack`, error, user?.name);
    }
}
export default attack;
