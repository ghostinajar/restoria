// attack
// user command to attack a target

import { IAgent } from "../model/classes/Agent.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findMobByKeywordInRoom from "../util/findMobByKeywordInRoom.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";
import resolveImmediateAction from "../util/resolveImmediateAction.js";

async function attack(parsedCommand: IParsedCommand, user: IUser) {
  try {
    // fail if user didn't specify a target
    if (!parsedCommand.directObject) {
      messageToUsername(user.username, `Attack what?`, `rejection`, true);
      return;
    }

    // fail if the room doesn't allow combat
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
      messageToUsername(
        user.username,
        `You couldn't find any ${parsedCommand.directObject} to attack.`,
        `rejection`
      );
      return;
    }

    // if ready, resolve now
    if (user.readyForAttack) {
      await resolveImmediateAction("attack", user, target);
      user.readyForAttack = false;
      return;
    }    

    // attacker not ready
    // TODO queue the action 
    // const targetAsUser = target as IUser;
    //   const targetAsMob = target as IMob;
    //   let targetNameForAction = target.name;
    //   if (targetAsMob.keywords) {
    //     targetNameForAction = targetAsMob.keywords[0];
    //   }
    //   let targetTypeForAction = "mob";
    //   if (targetAsUser.username) {
    //     targetTypeForAction = "user";
    //   }

  } catch (error: unknown) {
    catchErrorHandlerForFunction(`attack`, error, user?.name);
  }
}

export default attack;
