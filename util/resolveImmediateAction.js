// resolveImmediateAction
// takes an Action and resolves its effects between agent/target, including messaging affected users
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function resolveImmediateAction(actionName, agent, target, room) {
    try {
        // switch on action.actionName to run handler
    }
    catch (error) {
        catchErrorHandlerForFunction(`resolveAction`, error);
    }
}
export default resolveImmediateAction;
