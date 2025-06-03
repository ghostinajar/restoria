// stop
// clear's an agent's actionQueue

import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function stop(parsedCommand: IParsedCommand, agent: IUser) {
  try {
    agent.stop();
    if (agent.agentType === "user") {
      let user = agent as IUser;
      messageToUsername(
        user.username,
        `You stop! (Your queued actions are canceled.)`
      );
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`stop`, error, agent?.name);
  }
}

export default stop;
