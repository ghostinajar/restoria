// resolveImmediateAction
// takes an Action and resolves its effects between agent/target, including messaging affected users
// this is usually called from a queued action when the tick rolls over, but can also be called between ticks
// when an agent enters a command and ready for action right away
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import resolveAttackHandler from "./resolveActionHandlers/resolveAttackHandler.js";
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
    console.log(`${agent.name}'s combatTargetId ${agent.combatTargetId}`);
    agent.combatTargetName = target.name;
    console.log(`${agent.name}'s combatTargetName ${agent.combatTargetName}`);
    if (agent.agentType === "user") {
        let user = agent;
        user.updateHUD();
    }
}
export default resolveImmediateAction;
