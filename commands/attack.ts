// attack
// agent command to attack a target

import QueuedAction from "../model/classes/Action.js";
import { IAgent } from "../model/classes/Agent.js";
import { IMob } from "../model/classes/Mob.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findMobByKeywordInRoom from "../util/findMobByKeywordInRoom.js";
import getRoomByLocation from "../util/getRoomByLocation.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";
import resolveImmediateAction from "../util/resolveImmediateAction.js";

async function attack(parsedCommand: IParsedCommand, agent: IAgent) {
  try {
    // fail if user didn't specify a target
    if (!parsedCommand.directObject) {
      if (agent.agentType === "user") {
        const user = agent as IUser;
        messageToUsername(user.username, `Attack what?`, `rejection`, true);
      }
      return;
    }

    // fail if the room doesn't allow combat
    const room = await getRoomByLocation(agent.location);
    if (!room) {
      throw new Error(`Couldn't find room for ${agent.name}`);
    }
    if (room?.noCombat && agent.agentType === "user") {
      const user = agent as IUser;
      messageToUsername(
        user.username,
        `Combat isn't allowed in this room.`,
        `rejection`,
        true
      );
      return;
    }

    // is target a mob?
    let target: IAgent | undefined = findMobByKeywordInRoom(
      room,
      parsedCommand.directObject,
      parsedCommand.directObjectOrdinal
    );

    // if not mob, is target a user?
    if (!target) {
      target = room.users.find((user) =>
        user.username.startsWith(parsedCommand.directObject as string)
      );
    }

    // fail if no valid target
    if (!target) {
      if (agent.agentType === "user") {
        const user = agent as IUser;
        messageToUsername(
          user.username,
          `You couldn't find any ${parsedCommand.directObject} to attack.`,
          `rejection`
        );
      }
      return;
    }

    // if ready, resolve now
    if (agent.readyForAttack) {
      await resolveImmediateAction("attack", agent, target);
      agent.readyForAttack = false;
      return;
    }

    // attacker isn't ready
    // pack the queuedAction
    let queuedAction = new QueuedAction(
      "attack",
      "attack",
      agent._id,
      agent.agentType,
      agent.name,
      target._id,
      target.agentType,
      target.name
    );
    if (target.agentType === "mob") {
      const targetAsMob = target as IMob;
      queuedAction.targetName = targetAsMob.keywords[0];
    }
    agent.queueAction(queuedAction);
  } catch (error: unknown) {
    if (agent.agentType === "user") {
      const user = agent as IUser;
      catchErrorHandlerForFunction(`attack`, error, user?.name);
    } else {
      catchErrorHandlerForFunction(`attack`, error);
    }
  }
}

export default attack;
