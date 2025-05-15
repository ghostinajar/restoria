// getOnlineUserById
// returns a user object if online, or undefined

import mongoose from "mongoose";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import worldEmitter from "../model/classes/WorldEmitter.js";

async function getOnlineUserById(id: mongoose.Types.ObjectId) {
  try {
    const user: IUser = await new Promise((resolve) => {
      worldEmitter.once(`userManagerReturningOnlineUser${id.toString()}`, resolve);
      worldEmitter.emit("onlineUserRequestedById", id);
    });
    return user;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`getOnlineUserById`, error);
  }
}

export default getOnlineUserById;
