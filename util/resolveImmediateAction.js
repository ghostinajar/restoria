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
                agent.combatEngage({
                    id: target._id,
                    name: target.name,
                    type: target.agentType,
                });
                resolveAttackHandler(agent, target, room);
                agent.lastAttackActionDate = new Date();
                break;
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`resolveAction`, error);
    }
}
export default resolveImmediateAction;
