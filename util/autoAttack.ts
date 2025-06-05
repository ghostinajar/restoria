// autoAttack
// shared method logic for agent autoattack

import { IAgent } from "../model/classes/Agent.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import getMobById from "./getMobById.js";
import resolveImmediateAction from "./resolveImmediateAction.js";

async function autoAttack(agent: IAgent) {
  try {
    if (agent.readyForAttackAction && agent.combatTargetId) {
      let target = await getMobById(agent.combatTargetId);
      if (!target) {
        agent.disengageCombat();
        return;
      }
      const areInSameRoom =
        agent.location.inRoom.toString() === target.location.inRoom.toString();
      if (areInSameRoom) {
        await resolveImmediateAction("attack", agent, target);
        if (agent.agentType === "user") {
          const user = agent as IUser;
          user.updateHUD();
        }
      } else {
        agent.disengageCombat();
        return;
      }
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`autoAttack`, error);
  }
}

export default autoAttack;
