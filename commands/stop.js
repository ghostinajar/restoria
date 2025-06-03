// stop
// clear's an agent's actionQueue
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
async function stop(parsedCommand, agent) {
    try {
        agent.stop();
        if (agent.agentType === "user") {
            let user = agent;
            messageToUsername(user.username, `You stop! (Your queued actions are canceled.)`);
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`stop`, error, agent?.name);
    }
}
export default stop;
