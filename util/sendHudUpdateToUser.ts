// sendHudUpdateToUser
// messages a hudUpdate object to be processed and displayed by client

import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IUser } from "../model/classes/User.js";

export interface IHudUpdatePackage {
  combatTargetName: string | undefined;
  actionQueueLabels: [
    string | undefined,
    string | undefined,
    string | undefined
  ];
  bonusActionQueueLabels: [
    string | undefined,
    string | undefined,
    string | undefined
  ];
}

function sendHudUpdateToUser(user: IUser) {
  try {
    const hudUpdatePackage: IHudUpdatePackage = {
      combatTargetName: user.combatTargetName,
      actionQueueLabels: [
        user.actionQueue[0]?.actionLabel,
        user.actionQueue[1]?.actionLabel,
        user.actionQueue[2]?.actionLabel,
      ],
      bonusActionQueueLabels: [
        user.bonusActionQueue[0]?.actionLabel,
        user.bonusActionQueue[1]?.actionLabel,
        user.bonusActionQueue[2]?.actionLabel,
      ],
    };
    worldEmitter.emit(`hudUpdateFor${user.username}`, hudUpdatePackage);
    return;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`sendHudUpdateToUser`, error);
  }
}

export default sendHudUpdateToUser;
