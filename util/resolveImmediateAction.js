// resolveImmediateAction
// takes an Action and resolves its effects between agent/target, including messaging affected users
// this is usually called from a queued action when the tick rolls over, but can also be called between ticks
// when an agent enters a command and ready for action right away
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import messageToUsername from "./messageToUsername.js";
import resolveAttackHandler from "./resolveActionHandlers/resolveAttackHandler.js";
import sendHudUpdateToUser from "./sendHudUpdateToUser.js";
async function resolveImmediateAction(actionName, agent, target, room) {
    try {
        // switch on action.actionName to run handler
        switch (actionName) {
            case "attack":
                //console.log(`resolveImmediateAction calling resolveAttackHandler`);
                setCombatTargetForAgent(agent, target);
                resolveAttackHandler(agent, target, room);
                break;
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`resolveAction`, error);
    }
}
function setCombatTargetForAgent(agent, target) {
    agent.combatTargetId = target._id;
    agent.combatTargetName = target.name;
    if (agent.agentType === "user") {
        let user = agent;
        messageToUsername(user.username, `You are now targeting ${target.name}.`);
        sendHudUpdateToUser(user);
    }
}
export default resolveImmediateAction;
