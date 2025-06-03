// attack
// user command to attack a target
import QueuedAction from "../model/classes/Action.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findMobByKeywordInRoom from "../util/findMobByKeywordInRoom.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import messageToUsername from "../util/messageToUsername.js";
import resolveImmediateAction from "../util/resolveImmediateAction.js";
async function attack(parsedCommand, user) {
    try {
        // fail if user didn't specify a target
        if (!parsedCommand.directObject) {
            messageToUsername(user.username, `Attack what?`, `rejection`, true);
            return;
        }
        // fail if the room doesn't allow combat
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Couldn't find room for ${user.name}`);
        }
        if (room?.noCombat) {
            messageToUsername(user.username, `Combat isn't allowed in this room.`, `rejection`, true);
            return;
        }
        // is target a mob?
        let target = findMobByKeywordInRoom(room, parsedCommand.directObject, parsedCommand.directObjectOrdinal);
        // if not mob, is target a user?
        if (!target) {
            target = room.users.find((user) => user.username.startsWith(parsedCommand.directObject));
        }
        // fail if no valid target
        if (!target) {
            messageToUsername(user.username, `You couldn't find any ${parsedCommand.directObject} to attack.`, `rejection`);
            return;
        }
        // if ready, resolve now
        if (user.readyForAttack) {
            await resolveImmediateAction("attack", user, target);
            user.readyForAttack = false;
            return;
        }
        // attacker isn't ready
        // pack the queuedAction
        let queuedAction = new QueuedAction("attack", "attack", user._id, user.agentType, user.name, target._id, target.agentType, target.name);
        if (target.agentType === "mob") {
            const targetAsMob = target;
            queuedAction.targetName = targetAsMob.keywords[0];
        }
        user.queueAction(queuedAction);
    }
    catch (error) {
        catchErrorHandlerForFunction(`attack`, error, user?.name);
    }
}
export default attack;
