// autoAttack
// shared method logic for agent autoattack

import { IAgent } from "../model/classes/Agent.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import getMobById from "./getMobById.js";
import getOnlineUserById from "./getOnlineUserById.js";
import resolveImmediateAction from "./resolveImmediateAction.js";

async function autoAttack(agent: IAgent) {
  try {
    if (agent.readyForAttackAction && agent.combatTarget) {
      let target: IAgent | undefined = undefined;
      if (agent.combatTarget.type === "mob") {
        target = await getMobById(agent.combatTarget.id);
      }
      if (agent.combatTarget.type === "user") {
        target = await getOnlineUserById(agent.combatTarget.id);
      }
      if (!target) {
        agent.combatDisengage();
        return;
      }

      const areInSameRoom =
        agent.location.inRoom.toString() === target.location.inRoom.toString();
      if (!areInSameRoom) {
        agent.combatDisengage();
        return;
      }

      await resolveImmediateAction("attack", agent, target);
      if (agent.agentType === "user") {
        const user = agent as IUser;
      }
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`autoAttack`, error);
  }
}

export default autoAttack;
