// combatTargetIsInRoom
// returns true if mob or user is present in a given room
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function combatTargetIsInRoom(room, combatTarget) {
    try {
        // For user targets
        if (combatTarget.type === "user") {
            const userInRoom = room.users.find((u) => u._id.toString() === combatTarget.id.toString());
            if (userInRoom) {
                return true;
            }
        }
        // For mob targets
        if (combatTarget.type === "mob") {
            const mobInRoom = room.mobs.find((m) => m._id.toString() === combatTarget.id.toString());
            if (mobInRoom) {
                return true;
            }
        }
        return false;
    }
    catch (error) {
        catchErrorHandlerForFunction(`combatTargetIsInRoom`, error);
        return false;
    }
}
export default combatTargetIsInRoom;
