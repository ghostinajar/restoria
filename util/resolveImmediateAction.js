// resolveImmediateAction
// takes an Action and resolves its effects between agent/target, including messaging affected users
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import resolveAttackHandler from "./resolveActionHandlers/resolveAttackHandler.js";
async function resolveImmediateAction(actionName, agent, target, room) {
    try {
        // switch on action.actionName to run handler
        switch (actionName) {
            case "attack":
                //console.log(`resolveImmediateAction calling resolveAttackHandler`);
                resolveAttackHandler(agent, target, room);
                break;
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`resolveAction`, error);
    }
}
export default resolveImmediateAction;
