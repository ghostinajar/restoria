// Grudge
// a record of someone an agent wants to attack, with a name, id, and date when the grudge started

import mongoose from "mongoose";
import { AgentType } from "./Agent.js";

export interface IGrudge {
  targetId: mongoose.Types.ObjectId;
  targetName: string;
  targetType: AgentType;
  date: Date;
}

export class Grudge implements IGrudge {
  constructor(
    targetId: mongoose.Types.ObjectId,
    targetName: string,
    targetType: AgentType
  ) {
    this.targetId = targetId;
    this.targetName = targetName;
    this.targetType = targetType;
    this.date = new Date();
  }
  targetId: mongoose.Types.ObjectId;
  targetName: string;
  targetType: AgentType;
  date: Date;
}

export default IGrudge;
