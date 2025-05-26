// resolveQueuedAction
// finds agents & room involved in a queued action, and calls resolveImmediateAction if still appropriate
// (QueuedAction hold ids instead of references to live agents, in case the agents are deconstructed or otherwise unavailable at the time the action resolves)
import logger from "../logger.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import findAgentByIdInRoom from "./findAgentByIdInRoom.js";
import getMobById from "./getMobById.js";
import getOnlineUserById from "./getOnlineUserById.js";
import getRoomByLocation from "./getRoomByLocation.js";
import messageToUsername from "./messageToUsername.js";
import resolveImmediateAction from "./resolveImmediateAction.js";
async function resolveQueuedAction(action) {
    try {
        let agent;
        // fail if agent is user and can't be found
        if (action.agentType === "user") {
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
        //console.log(`resolveQueuedAction found agent: ${agent.name}`)
        const room = await getRoomByLocation(agent.location);
        if (!room) {
            throw new Error(`Couldn't find room by location of agent`);
        }
        //console.log(`resolveQueuedAction found room: ${room.name}`);
        // fail if target can't be found
        const target = findAgentByIdInRoom(room, action.targetId, action.targetType);
        if (!target) {
            if (action.agentType === "user") {
                let user = agent;
                messageToUsername(user.username, `You couldn't find your target!`, `rejection`, true);
            }
            return;
        }
        //console.log(`resolveQueuedAction calling resolveImmediateAction for action: ${action.actionName} by agent ${agent.name} to target ${target.name}`)
        resolveImmediateAction(action.actionName, agent, target, room);
    }
    catch (error) {
        catchErrorHandlerForFunction(`resolveAction`, error);
    }
}
export default resolveQueuedAction;
