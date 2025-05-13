// Grudge
// a record of someone an agent wants to attack, with a name, id, and date when the grudge started

import mongoose from "mongoose";

export interface IGrudge {
  targetId: mongoose.Types.ObjectId;
  targetName: string;
  date: Date;
  priority: number;
}

export class Grudge implements IGrudge {
  constructor(
    targetId: mongoose.Types.ObjectId,
    targetName: string,
    date: Date
  ) {
    this.targetId = targetId;
    this.targetName = targetName;
    this.date = new Date();
    this.priority = 0;
  }
  targetId: mongoose.Types.ObjectId;
  targetName: string;
  date: Date;
  priority: number;
}

export default IGrudge;
