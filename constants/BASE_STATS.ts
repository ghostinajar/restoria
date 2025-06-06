// base stats, and calculations for derived/runtime stats on mobs and users
import { IMob } from "../model/classes/Mob.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

const BASE_STRENGTH = 2;
const BASE_DEXTERITY = 2;
const BASE_CONSTITUTION = 2;
const BASE_INTELLIGENCE = 2;
const BASE_WISDOM = 2;
const BASE_CHARISMA = 2;
const BASE_HP = 10;
const BASE_MP = 10;
const BASE_MV = 10;
const BASE_SPEED = 0; // decreases movement cooldown
const BASE_HITBONUS = 2;
const BASE_DAMAGEBONUS = 0;
const BASE_ARMOR_CLASS = 10;
const BASE_HEALTH_REGEN = 2; // recovers a percentage of max per 6 seconds
const BASE_MANA_REGEN = 2;
const BASE_MOVE_REGEN = 2;
const BASE_RESIST_COLD = 0;
const BASE_RESIST_ELECTRIC = 0;
const BASE_RESIST_FIRE = 0;
const BASE_SPELL_SAVE = 0;

const BASE_CLERIC = {
  hpMod: 10,
  mpMod: 10,
  ssMod: 0.1,
};

const BASE_MAGE = {
  hpMod: 6,
  mpMod: 12,
  ssMod: 0.1,
};

const BASE_ROGUE = {
  hpMod: 10,
  mpMod: 8,
  dbMod: 0.25,
  hbMod: 0.13,
};

const BASE_WARRIOR = {
  hpMod: 12,
  mpMod: 6,
  dbMod: 0.13,
  hbMod: 0.25,
  acMod: 0.1,
};

export function calculateMaxHp(agent: IUser | IMob) {
  try {
    let maxHp = BASE_HP;
    maxHp += Math.max(0, (agent.statBlock.constitution - 10) / 2) * agent.level;
    if (agent.job === "cleric") {
      maxHp += agent.level * BASE_CLERIC.hpMod;
    }
    if (agent.job === "mage") {
      maxHp += agent.level * BASE_MAGE.hpMod;
    }
    if (agent.job === "rogue") {
      maxHp += agent.level * BASE_ROGUE.hpMod;
    }
    if (agent.job === "warrior") {
      maxHp += agent.level * BASE_WARRIOR.hpMod;
    }
    maxHp += agent.affixBonuses.health;
    return Math.max(BASE_HP, maxHp);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateMaxHp`, error);
    return 0;
  }
}

export function calculateMaxMp(agent: IUser | IMob) {
  try {
    let maxMp = BASE_MP;

    if (agent.job === "cleric") {
      maxMp += agent.level * BASE_CLERIC.mpMod;
      maxMp += Math.max(0, agent.statBlock.wisdom - 10) * agent.level;
    }
    if (agent.job === "mage") {
      maxMp += agent.level * BASE_MAGE.mpMod;
      maxMp += Math.max(0, agent.statBlock.intelligence - 10) * agent.level;
    }
    if (agent.job === "rogue") {
      maxMp += agent.level * BASE_ROGUE.mpMod;
    }
    if (agent.job === "warrior") {
      maxMp += agent.level * BASE_WARRIOR.mpMod;
    }
    maxMp += agent.affixBonuses.mana;
    return Math.max(BASE_MP, maxMp);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateMaxMp`, error);
    return 0;
  }
}

export function calculateMaxMv(agent: IUser | IMob) {
  try {
    let maxMv = BASE_MV;
    maxMv += agent.level * 10;
    maxMv += ((agent.statBlock.constitution - 10) / 2) * agent.level;
    maxMv += agent.affixBonuses.movement;
    return Math.max(BASE_MV, maxMv);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateMaxMv`, error);
    return 0;
  }
}

export function calculateStrength(agent: IUser | IMob) {
  try {
    let strength = agent.statBlock.strength;
    strength += agent.affixBonuses.strength;
    strength = Math.max(BASE_STRENGTH, strength); // correct if reduced to below base
    strength = Math.min(20, strength); // correct if above max of 20
    return strength;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateStrength`, error);
    return 0;
  }
}

export function calculateDexterity(agent: IUser | IMob) {
  try {
    let dexterity = agent.statBlock.dexterity;
    dexterity += agent.affixBonuses.dexterity;
    dexterity = Math.max(BASE_DEXTERITY, dexterity); // correct if reduced to below base
    dexterity = Math.min(20, dexterity); // correct if above max of 20
    return dexterity;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateDexterity`, error);
    return 0;
  }
}

export function calculateConstitution(agent: IUser | IMob) {
  try {
    let constitution = agent.statBlock.constitution;
    constitution += agent.affixBonuses.constitution;
    constitution = Math.max(BASE_CONSTITUTION, constitution); // correct if reduced to below base
    constitution = Math.min(20, constitution); // correct if above max of 20
    return constitution;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateConstitution`, error);
    return 0;
  }
}

export function calculateIntelligence(agent: IUser | IMob) {
  try {
    let intelligence = agent.statBlock.intelligence;
    intelligence += agent.affixBonuses.intelligence;
    intelligence = Math.max(BASE_INTELLIGENCE, intelligence); // correct if reduced to below base
    intelligence = Math.min(20, intelligence); // correct if above max of 20
    return intelligence;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateIntelligence`, error);
    return 0;
  }
}

export function calculateWisdom(agent: IUser | IMob) {
  try {
    let wisdom = agent.statBlock.wisdom;
    wisdom += agent.affixBonuses.wisdom;
    wisdom = Math.max(BASE_WISDOM, wisdom); // correct if reduced to below base
    wisdom = Math.min(20, wisdom); // correct if above max of 20
    return wisdom;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateWisdom`, error);
    return 0;
  }
}

export function calculateCharisma(agent: IUser | IMob) {
  try {
    let charisma = agent.statBlock.charisma;
    charisma += agent.affixBonuses.charisma;
    charisma = Math.max(BASE_CHARISMA, charisma); // correct if reduced to below base
    charisma = Math.min(20, charisma); // correct if above max of 20
    return charisma;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateCharisma`, error);
    return 0;
  }
}

export function calculateDamageBonus(agent: IUser | IMob) {
  try {
    let damageBonus = BASE_DAMAGEBONUS;
    damageBonus += Math.floor((agent.statBlock.strength - 10) / 2);
    damageBonus += agent.affixBonuses.damageBonus;
    if (agent.job === "rogue") {
      damageBonus += Math.floor(agent.level * BASE_ROGUE.dbMod);
    }
    if (agent.job === "warrior") {
      damageBonus += Math.floor(agent.level * BASE_WARRIOR.dbMod);
    }
    return Math.max(BASE_DAMAGEBONUS, damageBonus);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateDamageBonus`, error);
    return 0;
  }
}

export function calculateHitBonus(agent: IUser | IMob) {
  try {
    let hitBonus = BASE_HITBONUS;
    hitBonus += Math.floor((agent.statBlock.dexterity - 10) / 2);
    hitBonus += agent.affixBonuses.hitBonus;
    if (agent.job === "rogue") {
      hitBonus += Math.floor(agent.level * BASE_ROGUE.hbMod);
    }
    if (agent.job === "warrior") {
      hitBonus += Math.floor(agent.level * BASE_WARRIOR.hbMod);
    }
    return Math.max(BASE_HITBONUS, hitBonus);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateHitBonus`, error);
    return 0;
  }
}

export function calculateArmorClass(agent: IUser | IMob) {
  try {
    let armorClass = BASE_ARMOR_CLASS;
    armorClass += Math.floor((agent.statBlock.dexterity - 10) / 2);
    armorClass += agent.affixBonuses.armorClass;
    if (agent.job === "warrior") {
      armorClass += Math.floor(agent.level * BASE_WARRIOR.acMod);
    }
    return Math.max(BASE_ARMOR_CLASS, armorClass);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateArmorClass`, error);
    return 0;
  }
}

export function calculateSpellSave(agent: IUser | IMob) {
  try {
    let spellSave = BASE_SPELL_SAVE;
    spellSave += Math.floor((agent.statBlock.wisdom - 10) / 2);
    spellSave += agent.affixBonuses.spellSave;
    if (agent.job === "cleric") {
      spellSave += Math.floor(agent.level * BASE_CLERIC.ssMod);
    }
    if (agent.job === "mage") {
      spellSave += Math.floor(agent.level * BASE_MAGE.ssMod);
    }

    return Math.max(BASE_SPELL_SAVE, spellSave);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateSpellSave`, error);
    return 0;
  }
}

export function calculateSpeed(agent: IUser | IMob) {
  try {
    let speed = BASE_SPEED;
    speed += Math.floor((agent.statBlock.dexterity - 10) / 2);
    speed += agent.affixBonuses.speed;
    return Math.max(BASE_SPEED, speed);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateSpeed`, error);
    return 0;
  }
}

export function calculateResistCold(agent: IUser | IMob) {
  try {
    let resistCold = BASE_RESIST_COLD;
    resistCold += agent.affixBonuses.resistCold;
    return Math.max(BASE_RESIST_COLD, resistCold);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateResistCold`, error);
    return 0;
  }
}

export function calculateResistFire(agent: IUser | IMob) {
  try {
    let resistFire = BASE_RESIST_FIRE;
    resistFire += agent.affixBonuses.resistFire;
    return Math.max(BASE_RESIST_FIRE, resistFire);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateResistFire`, error);
    return 0;
  }
}

export function calculateResistElec(agent: IUser | IMob) {
  try {
    let resistElec = BASE_RESIST_ELECTRIC;
    resistElec += agent.affixBonuses.resistElectric;
    return Math.max(BASE_RESIST_ELECTRIC, resistElec);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateResistElec`, error);
    return 0;
  }
}

export function calculateHealthRegen(agent: IUser | IMob) {
  try {
    let healthRegen = BASE_HEALTH_REGEN;
    healthRegen += Math.floor((agent.statBlock.constitution - 10) / 2);
    healthRegen += agent.affixBonuses.healthRegen;
    return Math.max(BASE_HEALTH_REGEN, healthRegen);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateHealthRegen`, error);
    return 0;
  }
}

export function calculateManaRegen(agent: IUser | IMob) {
  try {
    let manaRegen = BASE_MANA_REGEN;
    manaRegen += Math.floor(
      (agent.statBlock.wisdom + agent.statBlock.intelligence - 20) / 4
    );
    manaRegen += agent.affixBonuses.manaRegen;
    return Math.max(BASE_MANA_REGEN, manaRegen);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateManaRegen`, error);
    return 0;
  }
}

export function calculateMoveRegen(agent: IUser | IMob) {
  try {
    let moveRegen = BASE_MOVE_REGEN;
    moveRegen += Math.floor((agent.statBlock.constitution - 10) / 2);
    moveRegen += agent.affixBonuses.moveRegen;
    return Math.max(BASE_MOVE_REGEN, moveRegen);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`calculateMoveRegen`, error);
    return 0;
  }
}
