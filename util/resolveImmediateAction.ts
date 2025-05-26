// resolveImmediateAction
// takes an Action and resolves its effects between agent/target, including messaging affected users

import { IAgent } from "../model/classes/Agent.js";
import { IRoom } from "../model/classes/Room.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import resolveAttackHandler from "./resolveActionHandlers/resolveAttackHandler.js";

async function resolveImmediateAction(
  actionName: string,
  agent: IAgent,
  target: IAgent,
  room?: IRoom
) {
  try {
    // switch on action.actionName to run handler
    switch (actionName) {
      case "attack":
        //console.log(`resolveImmediateAction calling resolveAttackHandler`);
        resolveAttackHandler(agent, target, room);
        break;
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`resolveAction`, error);
  }
}

export default resolveImmediateAction;
