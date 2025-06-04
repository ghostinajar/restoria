import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
function stats(user) {
    try {
        user.updateHUD();
    }
    catch (error) {
        catchErrorHandlerForFunction("stats", error, user.name);
    }
}
export default stats;
