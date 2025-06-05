// resolveImmediateAction
// takes an Action and resolves its effects between agent/target, including messaging affected users
// this is usually called from a queued action when the tick rolls over, but can also be called between ticks
// when an agent enters a command and ready for action right away

import { IAgent } from "../model/classes/Agent.js";
import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
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
        setCombatTargetForAgent(agent, target);
        resolveAttackHandler(agent, target, room);
        agent.lastAttackActionDate = new Date();
        break;
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`resolveAction`, error);
  }
}

function setCombatTargetForAgent(agent: IAgent, target: IAgent) {
  agent.combatTargetId = target._id;
  agent.combatTargetName = target.name;

  if (agent.agentType === "user") {
    let user = agent as IUser;
    user.updateHUD();
  }
}

export default resolveImmediateAction;
