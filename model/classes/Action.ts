// Action
// a class to define actions (whether full Action, attack, or bonus action) done by agents (user, mob, etc.)
// to be executed or added to action queues

import mongoose from "mongoose";
import SKILL from "../../constants/SKILL.js";
import SPELL from "../../constants/SPELL.js";
import { AgentType, IAgent } from "./Agent.js";

type ActionType = "attack" | "bonus" | "full";

const fullActionNames = [
  SKILL.AMBUSH,
  SKILL.CLEAVE,
  SKILL.DEFEND,
  SKILL.DISARM,
  SKILL.HIDE,
  SKILL.KICK,
  SKILL.MEDITATE,
  SKILL.SHOVE,
  SKILL.SNEAK_ATTACK,
  SKILL.THROW,
  SKILL.TRACK,
  SKILL.TRAP,
  SKILL.TRIP,
  SPELL.ARCANE_EYE,
  SPELL.ATTUNE,
  SPELL.BLIZZARD,
  SPELL.BLOOD_MAGIC,
  SPELL.BUBBLE,
  SPELL.CHARM,
  SPELL.COLD,
  SPELL.COLOR_SPRAY,
  SPELL.CONJURE_ELEMENTAL,
  SPELL.CURSE,
  SPELL.DIMENSION_DOOR,
  SPELL.DISINTEGRATE,
  SPELL.DISPEL_MAGIC,
  SPELL.DRAIN,
  SPELL.FEAR,
  SPELL.FIRE,
  SPELL.FIRESTORM,
  SPELL.GATE,
  SPELL.HARM,
  SPELL.HEAL,
  SPELL.LIGHTNING,
  SPELL.MANASHIELD,
  SPELL.MASS_INVISIBILITY,
  SPELL.MASS_LEVITATE,
  SPELL.MASS_REFRESH,
  SPELL.MINOR_CREATION,
  SPELL.MIRAGE,
  SPELL.MIRROR_IMAGES,
  SPELL.ONE_HEART,
  SPELL.PROTECT,
  SPELL.RESURRECT,
  SPELL.ROT,
  SPELL.SCRY,
  SPELL.SHIELD,
  SPELL.SLEEP,
  SPELL.SPIRIT_ARMOR,
  SPELL.SPIRIT_BOLT,
  SPELL.SPIRIT_SHOCK,
  SPELL.STONE_SKIN,
  SPELL.SUMMON,
  SPELL.TELEPORT,
  SPELL.THORNS,
  SPELL.TREMOR,
  SPELL.VISIT,
] as const;
type FullActionName = (typeof fullActionNames)[number];

const bonusActionNames = [
  SKILL.PICK,
  SKILL.SCAN,
  SKILL.SNEAK,
  SKILL.STEAL,
  SPELL.BERSERK,
  SPELL.BLESS,
  SPELL.BLIND,
  SPELL.BLINK,
  SPELL.BREADCRUMBS,
  SPELL.BREATHE_WATER,
  SPELL.CREATE_FOOD,
  SPELL.CREATE_WATER,
  SPELL.CURE_BLIND,
  SPELL.CURE_POISON,
  SPELL.DISCERN_SPIRIT,
  SPELL.ECHO_SPIRIT,
  SPELL.FAERIE_FIRE,
  SPELL.FARSIGHT,
  SPELL.IDENTIFY,
  SPELL.INFRAVISION,
  SPELL.INVISIBILITY,
  SPELL.LEVITATE,
  SPELL.LIFT_CURSE,
  SPELL.LOCATE_OBJECT,
  SPELL.MAGIC_MISSILE,
  SPELL.POISON,
  SPELL.REFRESH,
  SPELL.RESIST_COLD,
  SPELL.RESIST_ELECTRIC,
  SPELL.RESIST_FIRE,
  SPELL.SEE_INVISIBLE,
  SPELL.SENSE_LIFE,
  SPELL.SENSE_PRESENCE,
  SPELL.STRENGTH,
  SPELL.WEAKEN,
  SPELL.WORD_OF_RECALL,
];
type BonusActionName = (typeof bonusActionNames)[number];

export interface IAction {
  actionName: "attack" | FullActionName | BonusActionName;
  actionType: ActionType;
  agent: IAgent;
  agentType: AgentType;
  target: IAgent;
  targetType: AgentType;
  dateEntered: Date;
}

class Action implements IAction {
  constructor(
    actionName: "attack" | FullActionName | BonusActionName,
    actionType: ActionType,
    agent: IAgent,
    agentType: AgentType,
    target: IAgent,
    targetType: AgentType,
  ) {
    this.actionName = actionName;
    this.actionType = actionType;
    this.agent = agent;
    this.agentType = agentType;
    this.target = target;
    this.targetType = targetType;
    this.dateEntered = new Date();
  }
  actionName: "attack" | FullActionName | BonusActionName;
  actionType: ActionType;
  agent: IAgent;
  agentType: AgentType;
  target: IAgent;
  targetType: AgentType;
  dateEntered: Date;
}

export interface IQueuedAction {
  actionName: "attack" | FullActionName | BonusActionName;
  actionType: ActionType;
  agentId: mongoose.Types.ObjectId;
  agentType: AgentType;
  agentName: string;
  targetId: mongoose.Types.ObjectId; // we store the id and not a reference to the target itself because the target may not exist anymore when a queued action executes
  targetType: AgentType;
  targetName: string;
  dateEntered: Date;
  actionLabel: string;
}

export class QueuedAction implements IQueuedAction {
  constructor(
    actionName: "attack" | FullActionName | BonusActionName,
    actionType: ActionType,
    agentId: mongoose.Types.ObjectId,
    agentType: AgentType,
    agentName: string,
    targetId: mongoose.Types.ObjectId,
    targetType: AgentType,
    targetName: string
  ) {
    this.actionName = actionName;
    this.actionType = actionType;
    this.agentId = agentId;
    this.agentType = agentType;
    this.agentName = agentName;
    this.targetType = targetType;
    this.targetId = targetId;
    this.targetName = targetName;
    this.dateEntered = new Date();
    this.actionLabel = `${actionName} ${targetName}`;
  }
  actionName: "attack" | FullActionName | BonusActionName;
  actionType: ActionType;
  agentId: mongoose.Types.ObjectId;
  agentType: AgentType;
  agentName: string;
  targetId: mongoose.Types.ObjectId;
  targetType: AgentType;
  targetName: string;
  dateEntered: Date;
  actionLabel: string;
}

export default Action;
