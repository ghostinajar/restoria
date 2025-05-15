// getOnlineUserById
// returns a user object if online, or undefined
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
async function getOnlineUserById(id) {
    try {
        const user = await new Promise((resolve) => {
            worldEmitter.once(`userManagerReturningOnlineUser${id.toString()}`, resolve);
            worldEmitter.emit("onlineUserRequestedById", id);
        });
        return user;
    }
    catch (error) {
        catchErrorHandlerForFunction(`getOnlineUserById`, error);
    }
}
export default getOnlineUserById;
