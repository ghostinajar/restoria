// attack
// agent command to attack a target
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findMobByKeywordInRoom from "../util/findMobByKeywordInRoom.js";
import getRoomByLocation from "../util/getRoomByLocation.js";
import messageToUsername from "../util/messageToUsername.js";
import resolveImmediateAction from "../util/resolveImmediateAction.js";
async function attack(parsedCommand, agent) {
    try {
        // fail if user didn't specify a target
        if (!parsedCommand.directObject) {
            if (agent.agentType === "user") {
                const user = agent;
                messageToUsername(user.username, `Attack what?`, `rejection`, true);
            }
            return;
        }
        // fail if the room doesn't allow combat
        const room = await getRoomByLocation(agent.location);
        if (!room) {
            throw new Error(`Couldn't find room for ${agent.name}`);
        }
        if (room?.noCombat && agent.agentType === "user") {
            const user = agent;
            messageToUsername(user.username, `Combat isn't allowed in this room.`, `rejection`, true);
            return;
        }
        // fail if agent isn't ready
        if (!agent.readyForAttackAction) {
            if (agent.agentType === "user") {
                const user = agent;
                messageToUsername(user.username, `You're not ready to attack yet. Read HELP COOLDOWN.`, `rejection`, true);
            }
            return;
        }
        // find target among mobs
        let target = findMobByKeywordInRoom(room, parsedCommand.directObject, parsedCommand.directObjectOrdinal);
        // if not mob, find target among users
        if (!target) {
            target = room.users.find((user) => user.username.startsWith(parsedCommand.directObject));
        }
        // fail if no valid target
        if (!target) {
            if (agent.agentType === "user") {
                const user = agent;
                messageToUsername(user.username, `You couldn't find any ${parsedCommand.directObject} to attack.`, `rejection`);
            }
            return;
        }
        // if ready, resolve
        if (agent.readyForAttackAction) {
            await resolveImmediateAction("attack", agent, target);
            return;
        }
    }
    catch (error) {
        if (agent.agentType === "user") {
            const user = agent;
            catchErrorHandlerForFunction(`attack`, error, user?.name);
        }
        else {
            catchErrorHandlerForFunction(`attack`, error);
        }
    }
}
export default attack;
