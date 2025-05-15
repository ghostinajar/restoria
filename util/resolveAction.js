// resolveAction
// takes an Action and resolves its effects between agent/target, including messaging affected users
import logger from "../logger.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import findAgentByIdInRoom from "./findAgentByIdInRoom.js";
import getMobById from "./getMobById.js";
import getOnlineUserById from "./getOnlineUserById.js";
import getRoomByLocation from "./getRoomByLocation.js";
import messageToUsername from "./messageToUsername.js";
async function resolveAction(action) {
    try {
        let agent;
        // fail if agent is user and can't be found
        if (action.agentType === "user") {
            console.log("looking for online user");
            agent = await getOnlineUserById(action.agentId);
            if (!agent) {
                logger.info(`action for user id ${action.agentId} dismissed, user not found online`);
                return;
            }
        }
        // fail if agent is mob and can't be found
        if (action.agentType === "mob") {
            agent = await getMobById(action.agentId);
            if (!agent) {
                logger.info(`action for mob id ${action.agentId} dismissed, mob not found in restoria (probably dead or deconstructed)`);
                return;
            }
        }
        if (!agent) {
            // we should have returned by now if agent is missing, but just in case:
            return;
        }
        // fail if target can't be found
        const room = await getRoomByLocation(agent.location);
        if (!room) {
            throw new Error(`Couldn't find room by location of agent`);
        }
        const target = findAgentByIdInRoom(room, action.targetId, action.targetType);
        if (!target) {
            if (action.agentType === "user") {
                let user = agent;
                messageToUsername(user.username, `You couldn't find your target!`, `rejection`, true);
            }
            return;
        }
        // switch on action.actionName to run handler
    }
    catch (error) {
        catchErrorHandlerForFunction(`resolveAction`, error);
    }
}
export default resolveAction;
