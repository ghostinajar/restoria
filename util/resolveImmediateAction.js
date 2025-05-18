// resolveImmediateAction
// takes an Action and resolves its effects between agent/target, including messaging affected users
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import attackHandler from "./resolveActionHandlers/attackHandler.js";
async function resolveImmediateAction(actionName, agent, target, room) {
    try {
        // switch on action.actionName to run handler
        switch (actionName) {
            case "attack":
                attackHandler(agent, target);
                break;
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`resolveAction`, error);
    }
}
export default resolveImmediateAction;
