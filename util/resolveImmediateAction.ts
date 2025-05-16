// resolveImmediateAction
// takes an Action and resolves its effects between agent/target, including messaging affected users

import { IAgent } from "../model/classes/Agent.js";
import { IRoom } from "../model/classes/Room.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function resolveImmediateAction(actionName: string, agent: IAgent, target: IAgent, room: IRoom) {
  try {
    // switch on action.actionName to run handler
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`resolveAction`, error);
  }
}

export default resolveImmediateAction;
