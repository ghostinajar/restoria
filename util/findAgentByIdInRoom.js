// findAgentByIdInRoom
// returns an agent if found, or undefined
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function findAgentByIdInRoom(room, id, agentType) {
    try {
        const arrayToSearch = agentType === "user" ? room.users : room.mobs;
        const agent = arrayToSearch.find((agent) => agent._id === id);
        return agent;
    }
    catch (error) {
        catchErrorHandlerForFunction(`findUserByIdInRoom`, error);
    }
}
export default findAgentByIdInRoom;
