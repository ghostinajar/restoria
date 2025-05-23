// findUserByNameInRoom
// utility function to find IMob object by keyword and ordinal in a given room
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function findUserByNameInRoom(room, targetName) {
    try {
        const user = room.users.find((user) => user.username.startsWith(targetName));
        return user;
    }
    catch (error) {
        catchErrorHandlerForFunction(`findUserByNameInRoom`, error);
    }
}
export default findUserByNameInRoom;
