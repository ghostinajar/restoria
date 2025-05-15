// attackHandler
// resolveAction handler for attack

import { IAgent } from "../../model/classes/Agent.js";
import catchErrorHandlerForFunction from "../catchErrorHandlerForFunction.js";

async function attackHandler(agent: IAgent, target: IAgent) {
  try {
    
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`attackHandler`, error);
  }
}

export default attackHandler;