// messageToUsername
// utility to emit message to a user by username

import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import makeMessage from "./makeMessage.js";

async function messageToUsername(
  username: string,
  message: string,
  messageType: string = "info",
  safe: boolean = false
) {
  try {
    if (safe) {
      worldEmitter.emit(
        `safeMessageFor${username}`,
        makeMessage(messageType, message)
      );
      return;
    } else {
      worldEmitter.emit(
        `messageFor${username}`,
        makeMessage(messageType, message)
      );
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`messageToUsername`, error);
  }
}

export default messageToUsername;
