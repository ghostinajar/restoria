// findAgentByIdInRoom
// returns an agent if found, or undefined

import mongoose from "mongoose";
import { IRoom } from "../model/classes/Room.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import { AgentType, IAgent } from "../model/classes/Agent.js";

function findAgentByIdInRoom(
  room: IRoom,
  id: mongoose.Types.ObjectId,
  agentType: AgentType
): IAgent | undefined {
  try {
    const arrayToSearch = agentType === "user" ? room.users : room.mobs;
    const agent = arrayToSearch.find((agent) => agent._id === id);
    return agent;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`findUserByIdInRoom`, error);
  }
}

export default findAgentByIdInRoom;
