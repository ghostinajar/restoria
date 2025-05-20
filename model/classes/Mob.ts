import { IAffix } from "./Affix";
import { IChatter } from "./Chatter";
import { IDescription } from "./Description";
import { IEmote } from "./Emote";
import { IItem } from "./Item.js";
import { IMobBlueprint } from "./MobBlueprint";
import { IStatBlock } from "./StatBlock";
import mongoose from "mongoose";
import IEquipped from "../../types/Equipped";
import {
  calculateArmorClass,
  calculateCharisma,
  calculateConstitution,
  calculateDamageBonus,
  calculateDexterity,
  calculateHealthRegen,
  calculateHitBonus,
  calculateIntelligence,
  calculateManaRegen,
  calculateMaxHp,
  calculateMaxMp,
  calculateMaxMv,
  calculateMoveRegen,
  calculateResistCold,
  calculateResistElec,
  calculateResistFire,
  calculateSpeed,
  calculateSpellSave,
  calculateStrength,
  calculateWisdom,
} from "../../constants/BASE_STATS.js";
import { AFFIX_BONUSES, IAffixBonuses } from "../../constants/AFFIX_BONUSES.js";
import { IAgent } from "./Agent.js";
import { IQueuedAction } from "./Action.js";
import IGrudge from "./Grudge.js";
import { ILocation } from "./Location.js";
import rollDice from "../../util/rollDice.js";
import resolveQueuedAction from "../../util/resolveQueuedAction.js";

export interface IMob extends IAgent {
  _id: mongoose.Types.ObjectId;
  isUnique: boolean;
  isMount: boolean;
  isAggressive: boolean;
  chattersToPlayer: boolean;
  emotesToPlayer: boolean;
  keywords: Array<string>;
  chatters: Array<IChatter>;
  emotes: Array<IEmote>;
}

class Mob implements IMob {
  constructor(blueprint: IMobBlueprint, location: ILocation) {
    this._id = new mongoose.Types.ObjectId();
    this.author = blueprint.author;
    this.name = blueprint.name;
    this.location = location;
    this.pronouns = blueprint.pronouns;
    this.level = blueprint.level;
    this.job = blueprint.job;
    this.statBlock = blueprint.statBlock;
    this.goldHeld = blueprint.goldHeld;
    this.isUnique = blueprint.isUnique;
    this.isMount = blueprint.isMount;
    this.isAggressive = blueprint.isAggressive;
    this.chattersToPlayer = blueprint.chattersToPlayer;
    this.emotesToPlayer = blueprint.emotesToPlayer;
    this.description = blueprint.description;
    this.keywords = blueprint.keywords;
    this.affixes = blueprint.affixes;
    (this.equipped = {
      arms: null,
      body: null,
      ears: null,
      feet: null,
      finger1: null,
      finger2: null,
      hands: null,
      head: null,
      held: null,
      legs: null,
      neck: null,
      shield: null,
      shoulders: null,
      waist: null,
      wrist1: null,
      wrist2: null,
      weapon1: null,
      weapon2: null,
    }),
      (this.chatters = blueprint.chatters);
    this.emotes = blueprint.emotes;
    this.inventory = [];
    this.capacity = blueprint.capacity;
    this.affixBonuses = { ...AFFIX_BONUSES };
    this.currentHp = calculateMaxHp(this) || 20;
    this.maxHp = calculateMaxHp(this) || 20;
    this.healthRegen = calculateHealthRegen(this) || 0;
    this.currentMp = calculateMaxMp(this) || 20;
    this.maxMp = calculateMaxMp(this) || 20;
    this.manaRegen = calculateManaRegen(this) || 0;
    this.currentMv = calculateMaxMv(this) || 20;
    this.maxMv = calculateMaxMv(this) || 20;
    this.moveRegen = calculateMoveRegen(this) || 0;
    this.strength = calculateStrength(this) || 10;
    this.dexterity = calculateDexterity(this) || 10;
    this.constitution = calculateConstitution(this) || 10;
    this.intelligence = calculateIntelligence(this) || 10;
    this.wisdom = calculateWisdom(this) || 10;
    this.charisma = calculateCharisma(this) || 10;
    this.speed = calculateSpeed(this) || 0;
    this.hitBonus = calculateHitBonus(this) || 2;
    this.damageBonus = calculateDamageBonus(this) || 0;
    this.armorClass = calculateArmorClass(this) || 10;
    this.resistCold = calculateResistCold(this) || 0;
    this.resistElec = calculateResistElec(this) || 0;
    this.resistFire = calculateResistFire(this) || 0;
    this.spellSave = calculateSpellSave(this) || 0;
    this.readyForAttack = true;
    this.readyForAction = true;
    this.readyForBonusAction = true;
    this.actionQueue = [];
    this.bonusActionQueue = [];
    this.grudges = [];
  }
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  name: string;
  location: ILocation;
  pronouns: number;
  level: number;
  job: string;
  statBlock: IStatBlock;
  goldHeld: number;
  isUnique: boolean;
  isMount: boolean;
  isAggressive: boolean;
  chattersToPlayer: boolean;
  emotesToPlayer: boolean;
  description: IDescription;
  keywords: Array<string>;
  affixes: Array<IAffix>;
  equipped: IEquipped;
  chatters: Array<IChatter>;
  emotes: Array<IEmote>;
  inventory: Array<IItem>;
  capacity: number;
  affixBonuses: IAffixBonuses;
  currentHp: number;
  maxHp: number;
  healthRegen: number;
  currentMp: number;
  maxMp: number;
  manaRegen: number;
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

  async handleTick() {
    console.log(`${this.name} handleTick`);
    // Health regeneration
    if (this.currentHp < this.maxHp) {
      this.modifyHp(Math.max(0, this.maxHp / this.healthRegen));
    }

    // Mana regeneration
    if (this.currentMp < this.maxMp) {
      this.modifyMp(Math.max(0, this.maxMp / this.manaRegen));
    }

    // Movement regeneration
    if (this.currentMv < this.maxMv) {
      this.modifyMv(Math.max(0, this.maxMv / this.moveRegen));
    }

    // Reset combat readiness flags
    this.readyForAttack = true;
    this.readyForAction = true;
    this.readyForBonusAction = true;

    // Process action queues if they exist
    if (this.actionQueue && this.actionQueue.length > 0) {
      const nextAction = this.actionQueue[0];
      this.actionQueue = this.actionQueue.slice(1);
      await resolveQueuedAction(nextAction);
    }

    if (this.bonusActionQueue && this.bonusActionQueue.length > 0) {
      const nextBonusAction = this.bonusActionQueue[0];
      this.bonusActionQueue = this.bonusActionQueue.slice(1);
      await resolveQueuedAction(nextBonusAction);
    }
  }

  modifyHp(amount: number) {
    const newHp = Math.min(this.currentHp + amount, this.maxHp);
    this.currentHp = Math.max(0, newHp);
  }
  modifyMp(amount: number) {
    const newMp = Math.min(this.currentMp + amount, this.maxMp);
    this.currentMp = Math.max(0, newMp);
  }
  modifyMv(amount: number) {
    const newMv = Math.min(this.currentMv + amount, this.maxMv);
    this.currentMv = Math.max(0, newMv);
  }
  rollToHit(): number {
    const d20result = rollDice("1d20");
    return d20result ? d20result + this.hitBonus : 0;
  }
}

export default Mob;
