// sendHudUpdateToUser
// messages a hudUpdate object to be processed and displayed by client
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
function sendHudUpdateToUser(user) {
    try {
        const hudUpdatePackage = {
            combatTargetName: user.combatTargetName,
            actionQueueLabels: [
                user.actionQueue[0]?.actionLabel,
                user.actionQueue[1]?.actionLabel,
                user.actionQueue[2]?.actionLabel,
            ],
            bonusActionQueueLabels: [
                user.bonusActionQueue[0]?.actionLabel,
                user.bonusActionQueue[1]?.actionLabel,
                user.bonusActionQueue[2]?.actionLabel,
            ],
        };
        worldEmitter.emit(`hudUpdateFor${user.username}`, hudUpdatePackage);
        return;
    }
    catch (error) {
        catchErrorHandlerForFunction(`sendHudUpdateToUser`, error);
    }
}
export default sendHudUpdateToUser;
