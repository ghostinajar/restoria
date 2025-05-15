// getMobById
// returns a mob object if it still exists in MobManager, else undefined
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
async function getMobById(id) {
    try {
        const mob = await new Promise((resolve) => {
            worldEmitter.once(`mobManagerReturningMob${id.toString()}`, resolve);
            worldEmitter.emit("mobRequestedById", id);
        });
        return mob;
    }
    catch (error) {
        catchErrorHandlerForFunction(`getMobById`, error);
    }
}
export default getMobById;
