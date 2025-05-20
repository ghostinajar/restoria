// Agent
// interface defines props and methods in common for users and mobs, etc.

import mongoose from "mongoose";
import { IStatBlock } from "./StatBlock.js";
import { IDescription } from "./Description.js";
import { IAffix } from "./Affix.js";
import { IItem } from "./Item.js";
import IEquipped from "../../types/Equipped.js";
import { IAffixBonuses } from "../../constants/AFFIX_BONUSES.js";
import { IQueuedAction } from "./Action.js";
import IGrudge from "./Grudge.js";
import { ILocation } from "./Location.js";

export type AgentType = "user" | "mob";

export interface IAgent {
  author: mongoose.Types.ObjectId;
  name: string;
  location: ILocation;
  pronouns: number;
  level: number;
  job: string;
  statBlock: IStatBlock;
  description: IDescription;
  affixes: Array<IAffix>;
  inventory: Array<IItem>;
  capacity: number;
  equipped: IEquipped;
  affixBonuses: IAffixBonuses;
  currentHp: number;
  maxHp: number;
  healthRegen: number;
  currentMp: number;
  manaRegen: number;
  maxMp: number;
  currentMv: number;
  maxMv: number;
  moveRegen: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  speed: number;
  hitBonus: number;
  damageBonus: number;
  armorClass: number;
  resistCold: number;
  resistElec: number;
  resistFire: number;
  spellSave: number;
  readyForAttack: boolean;
  readyForAction: boolean;
  readyForBonusAction: boolean;
  actionQueue: Array<IQueuedAction>;
  bonusActionQueue: Array<IQueuedAction>;
  combatTargetId?: mongoose.Types.ObjectId;
  combatTargetName?: string;
  grudges: Array<IGrudge>;

  modifyHp(amount: number): void;
  modifyMp(amount: number): void;
  modifyMv(amount: number): void;
  rollToHit(): number;
}
