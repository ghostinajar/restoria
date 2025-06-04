// stats
// shows a user their basic stats on one line
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

function stats(user: IUser) {
  try {
    user.updateHUD();
  } catch (error: unknown) {
    catchErrorHandlerForFunction("stats", error, user.name);
  }
}

export default stats;
