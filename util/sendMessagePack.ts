// sendMessagePack
// sends messages about an event tailored to agent, target, and bystanders

import worldEmitter from "../model/classes/WorldEmitter.js";
import { IMessagePack } from "../types/Message.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function sendMessagePack(messagePack: IMessagePack) {
  try {
    // to agent
    if (messagePack.agentUsername && messagePack.messageForAgent) {
      worldEmitter.emit(
        `messageFor${messagePack.agentUsername}`,
        messagePack.messageForAgent
      );
    }

    // to target
    if (messagePack.targetUsername && messagePack.messageForTarget) {
      worldEmitter.emit(
        `messageFor${messagePack.targetUsername}`,
        messagePack.messageForTarget
      );
    }

    // to observers
    if (messagePack.observerUsernames && messagePack.messageForObservers) {
      messagePack.observerUsernames.forEach((observerUsername) => {
        worldEmitter.emit(
          `messageFor${observerUsername}`,
          messagePack.messageForObservers
        );
      });
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`messagePackForRoom`, error);
  }
}

export default sendMessagePack;
