const SKILL = {
  NONE: "none",
  AMBUSH: "ambush",
  CLEAVE: "cleave",
  DEFEND: "defend",
  DISARM: "disarm",
  HIDE: "hide",
  KICK: "kick",
  MEDITATE: "meditate",
  PICK: "pick",
  SCAN: "scan",
  SHOVE: "shove",
  SNEAK: "sneak",
  SNEAK_ATTACK: "sneak attack",
  STEAL: "steal",
  THROW: "throw",
  TRACK: "track",
  TRAP: "trap",
  TRIP: "trip",
};

const PASSIVE_SKILL = {
  DODGE: "dodge",
  GUARD: "guard", // sometimes takes a hit aimed at a party member with low health
  DUALWIELD: "dualwield",
  PARRY: "parry",
  SECOND_ATTACK: "second attack",
  THIRD_ATTACK: "third attack",
};

export const skills = [...Object.values(SKILL), Object.values(PASSIVE_SKILL)];

export default SKILL;
