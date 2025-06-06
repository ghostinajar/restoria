import mongoose from "mongoose";

interface ICombatTarget {
  id: mongoose.Types.ObjectId;
  name: String;
  type: String;
}

export default ICombatTarget;
