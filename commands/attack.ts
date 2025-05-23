// attack
// user command to attack a target

import Action, { IQueuedAction } from "../model/classes/Action.js";
import { AgentType, IAgent } from "../model/classes/Agent.js";
import { IMob } from "../model/classes/Mob.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findMobByKeywordInRoom from "../util/findMobByKeywordInRoom.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";
import resolveQueuedAction from "../util/resolveQueuedAction.js";
import sendHudUpdateToUser from "../util/sendHudUpdateToUser.js";

async function attack(parsedCommand: IParsedCommand, user: IUser) {
  try {
    if (!parsedCommand.directObject) {
      messageToUsername(user.username, `Attack what?`, `rejection`, true);
      return;
    }

    const room = await getRoomOfUser(user);
    if (!room) {
      throw new Error(`Couldn't find room for ${user.name}`);
    }

    if (room?.noCombat) {
      messageToUsername(
        user.username,
        `Combat isn't allowed in this room.`,
        `rejection`,
        true
      );
      return;
    }

    // fail if target not in room.mobs
    let target: IAgent | undefined = findMobByKeywordInRoom(
      room,
      parsedCommand.directObject,
      parsedCommand.directObjectOrdinal
    );

    // TODO when implementing PVP, try to find target among room.users
    if (!target) {
      target = room.users.find((user) =>
        user.username.startsWith(parsedCommand.directObject as string)
      );
    }

    if (!target) {
      messageToUsername(
        user.username,
        `You couldn't find any ${parsedCommand.directObject} to attack.`,
        `rejection`
      );
      return;
    }

    user.combatTargetId = target._id;
    user.combatTargetName = target.name;
    messageToUsername(user.username, `You are now targeting ${target.name}.`);
    sendHudUpdateToUser(user);

    if (user.readyForAttack) {
      const targetAsUser = target as IUser;
      const targetAsMob = target as IMob;
      let targetNameForAction = target.name;
      if (targetAsMob.keywords) {
        targetNameForAction = targetAsMob.keywords[0];
      }
      let targetTypeForAction = "mob"
      if (targetAsUser.username) {
        targetTypeForAction = "user"
      }
      const attackAction: IQueuedAction = new Action(
        user._id,
        "user",
        user.name,
        target._id,
        targetTypeForAction as AgentType,
        targetNameForAction,
        "attack"
      );
      console.log(`ATTACK command calling resolveQueuedAction on action:`);
      console.log(attackAction);
      await resolveQueuedAction(attackAction);
      user.readyForAttack = false;
      return;
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`attack`, error, user?.name);
  }
}

export default attack;
