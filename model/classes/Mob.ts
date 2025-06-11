// Mob
// Class for mob objects
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
import { AgentType, IAgent } from "./Agent.js";
import IGrudge from "./Grudge.js";
import { ILocation } from "./Location.js";
import rollDice from "../../util/rollDice.js";
import calculateAffixBonuses from "../../util/calculateAffixBonuses.js";
import { TICK_COOLDOWN } from "../../constants/COOLDOWNS.js";
import autoAttack from "../../util/autoAttack.js";
import getRoomByLocation from "../../util/getRoomByLocation.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";
import ICombatTarget from "../../types/CombatTarget.js";
import combatTargetIsInRoom from "../../util/combatTargetIsInRoom.js";
import messageToUsername from "../../util/messageToUsername.js";

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
    this.agentType = "mob";
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
    calculateAffixBonuses(this);
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
    this.lastAttackActionDate = new Date();
    this.lastBonusActionDate = new Date();
    this.lastFullActionDate = new Date();
    this.grudges = [];
  }
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  name: string;
  agentType: AgentType;
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
  lastAttackActionDate: Date;
  lastBonusActionDate: Date;
  lastFullActionDate: Date;
  combatTarget?: ICombatTarget;
  grudges: Array<IGrudge>;

  get nameCapitalized(): string {
    return `${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`;
  }

  get readyForAttackAction(): boolean {
    return (
      new Date().getTime() - this.lastAttackActionDate.getTime() >=
      TICK_COOLDOWN
    );
  }

  get readyForFullAction(): boolean {
    return (
      new Date().getTime() - this.lastFullActionDate.getTime() >= TICK_COOLDOWN
    );
  }

  get readyForBonusAction(): boolean {
    return (
      new Date().getTime() - this.lastBonusActionDate.getTime() >= TICK_COOLDOWN
    );
  }

  async handleTick() {
    try {
      // Health regeneration
      if (this.currentHp < this.maxHp) {
        this.modifyHp(Math.max(0, this.maxHp * this.healthRegen * 0.01));
      }

      // Mana regeneration
      if (this.currentMp < this.maxMp) {
        this.modifyMp(Math.max(0, this.maxMp / this.manaRegen));
      }

      // Movement regeneration
      if (this.currentMv < this.maxMv) {
        this.modifyMv(Math.max(0, this.maxMv / this.moveRegen));
      }

      // clear out grudges older than 60 seconds
      const now = Date.now();
      this.grudges = this.grudges.filter((grudge) => {
        return grudge.date && now - new Date(grudge.date).getTime() <= 60000;
      });

      console.log(`${this.name}'s combatTarget:`);
      console.log(this.combatTarget);

      // target a grudge if they're present in the room
      if (this.grudges.length > 0 && !this.combatTarget) {
        const room = await getRoomByLocation(this.location);
        if (!room) {
          throw new Error(
            `Couldn't find room for user ${this._id} ${this.name}`
          );
        }

        for (const grudge of this.grudges) {
          const potentialTarget: ICombatTarget = {
            name: grudge.targetName,
            id: grudge.targetId,
            type: grudge.targetType,
          };

          if (combatTargetIsInRoom(room, potentialTarget)) {
            this.combatEngage(potentialTarget);
            if (potentialTarget.type === "user") {
              messageToUsername(
                potentialTarget.name.toLowerCase(),
                `${this.nameCapitalized} remembers a grudge and targets you!`,
                `red`
              );
            }
            break;
          }
        }
      }

      // if no combat target and mob is aggro, set combat target to random user in room
      if (this.isAggressive && !this.combatTarget) {
        console.log(`${this.name} is aggro and looking for a target!`);
        const room = await getRoomByLocation(this.location);
        if (!room) {
          throw new Error(
            `mob.handleTick had trouble getting room for mob id ${this._id}`
          );
        }
        if (room.users.length > 0) {
          const randomUser =
            room.users[Math.floor(Math.random() * room.users.length)];
          console.log(`selected target ${randomUser.name} `);
          this.combatTarget = {
            id: randomUser._id,
            name: randomUser.name,
            type: "user",
          };
        }
      }

      // autoAttack combat target
      if (this.readyForAttackAction && this.combatTarget) {
        console.log(
          `attempting autoattack on ${this.combatTarget.name} ${this.combatTarget.id}`
        );
        autoAttack(this);
      }
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`mob.handleTick`, error, this.name);
    }
  }

  modifyHp(amount: number) {
    try {
      const newHp = Math.min(Math.round(this.currentHp + amount), this.maxHp);
      this.currentHp = Math.max(0, newHp);
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`mob.modifyHp`, error, this.name);
      return 0;
    }
  }
  modifyMp(amount: number) {
    try {
      const newMp = Math.min(Math.round(this.currentMp + amount), this.maxMp);
      this.currentMp = Math.max(0, newMp);
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`mob.modifyMp`, error, this.name);
      return 0;
    }
  }
  modifyMv(amount: number) {
    try {
      const newMv = Math.min(Math.round(this.currentMv + amount), this.maxMv);
      this.currentMv = Math.max(0, newMv);
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`mob.modifyMv`, error, this.name);
      return 0;
    }
  }
  rollToHit(): number {
    try {
      const d20result = rollDice("1d20");
      return d20result ? d20result + this.hitBonus : 0;
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`mob.rollToHit`, error, this.name);
      return 0;
    }
  }

  rollWeaponDamage(): number {
    try {
      // handle unarmed
      if (!this.equipped.weapon1 || !this.equipped.weapon1.weaponStats) {
        let unarmedRoll = rollDice("1d4");
        if (!unarmedRoll) {
          unarmedRoll = 1;
        }
        const damageResult = Math.max(0, unarmedRoll + this.damageBonus);
        return damageResult;
      }

      // handle weapon
      const diceString =
        this.equipped.weapon1.weaponStats.damageDieQuantity &&
        this.equipped.weapon1.weaponStats.damageDieSides
          ? `${this.equipped.weapon1.weaponStats.damageDieQuantity}d${this.equipped.weapon1.weaponStats.damageDieSides}`
          : `1d4`;

      const diceResult = rollDice(diceString);
      if (!diceResult) return this.damageBonus;
      const damageResult = Math.max(0, diceResult + this.damageBonus);
      return damageResult;
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`mob.rollWeaponDamage`, error, this.name);
      return 0;
    }
  }

  combatDisengage(): void {
    this.combatTarget = undefined;
  }

  combatEngage(target: ICombatTarget): void {
    this.combatTarget = target;
  }

  async faint(): Promise<void> {
    try {
      this.combatDisengage();

      const room = await getRoomByLocation(this.location);
      if (!room) {
        throw new Error(`Failed to find room for mob ${this._id} ${this.name}`);
      }

      room.users.forEach((u) => {
        // disengage users targeting this mob
        if (u.combatTarget?.id === this._id) {
          u.combatDisengage();
        }

        // notify users in the room
        messageToUsername(
          u.username,
          `${this.nameCapitalized} fainted!`,
          `red`
        );

        // reward users in the room also on mob's grudge list
        if (this.grudges.some((grudge) => grudge.targetName === u.name)) {
          // TODO user gains exp
          // TODO put a lootbag in user's lootBags
        }
      });

      room.mobs.forEach((m) => {
        // disengage mobs targeting this mob
        if (m.combatTarget?.id === this._id) {
          m.combatDisengage();
        }
      });

      // for every user in the room who is also in this mob's grudge list, create a loot bag in their lootInv
      // destroy this mob object (emit for MobManager)
    } catch (error: unknown) {
      catchErrorHandlerForFunction(`mob.faint`, error, this.name);
    }
  }

  // addGrudge(g: IGrudge): void {
  //   // get a matching grudge from this.grudges
  //   // if no match found, create one
  //   // shift the grudge to top of this.grudges
  // }
}

export default Mob;
