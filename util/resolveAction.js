// resolveAction
// takes an Action and resolves its effects between agent/target, including messaging affected users
import logger from "../logger.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import getMobById from "./getMobById.js";
import getOnlineUserById from "./getOnlineUserById.js";
async function resolveAction(action) {
    try {
        let agent;
        // fail if agent is user and can't be found
        if (action.targetType === "user") {
            console.log("looking for online user");
            agent = await getOnlineUserById(action.agentId);
            if (!agent) {
                logger.info(`action for user id ${action.agentId} dismissed, user not found online`);
                return;
            }
        }
        // fail if agent is mob and can't be found
        if (action.targetType === "mob") {
            agent = await getMobById(action.agentId);
            if (!agent) {
                logger.info(`action for mob id ${action.agentId} dismissed, mob not found in restoria (probably dead)`);
                return;
            }
        }
        if (!agent) {
            return;
        }
        // fail if target can't be found
        // switch on action.actionName to run handler
    }
    catch (error) {
        catchErrorHandlerForFunction(`resolveAction`, error);
    }
}
export default resolveAction;
