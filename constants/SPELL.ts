const SPELL = {
  NONE: "none",
  ARCANE_EYE: "arcane eye",  // shows a wide map of wilderness including number of mobs in each room
  ATTUNE: "attune", 
  BERSERK: "berserk", // causes a mob or player to follow themself (unfollowing others, or disbanding the group if they are the leader)
  BLESS: "bless", // temporary bonus to hb and ss
  BLIND: "blind", // temporary penalty to hb and ac
  BLINK: "blink", // relocates user to a random wilderness location nearby
  BLIZZARD: "blizzard", // multi-target cold damage
  BLOOD_MAGIC: "blood magic", // removes 5 or more levels of blood from the room, healing the party proportionately
  BREADCRUMBS: "breadcrumbs", // leaves a magical trace of the caster wherever they go, indicating how many times they have entered a room
  BREATHE_WATER: "breathe water",
  BUBBLE: "bubble", // prevents mobs from entering the room
  CHARM: "charm",
  COLD: "cold", // single target cold damage
  COLOR_SPRAY: "color spray",
  CONJURE_ELEMENTAL: "conjure elemental",
  CREATE_FOOD: "create food",
  CREATE_WATER: "create water",
  CURE_BLIND: "cure blind",
  CURE_FATIGUE: "cure fatigue",
  CURE_POISON: "cure poison",
  CURSE: "curse", // temporary penalty to hb and ss
  DIMENSION_DOOR: "dimension door", // move magically through an exit, even when closed/locked
  DISCERN_SPIRIT: "discern spirit", // see the spirit of creatures and players on their description
  DISINTEGRATE: "disintegrate", // 
  DISPEL_MAGIC: "dispel magic",
  DRAIN: "drain",
  ECHO_SPIRIT: "echo spirit", // reveal all hidden beings in a room
  FAERIE_FIRE: "faerie fire",
  FARSIGHT: "farsight",
  FATIGUE: "fatigue",
  FEAR: "fear",
  FIRE: "fire", // single target fire damage
  FIRESTORM: "firestorm", // multi-target fire damage
  GATE: "gate",
  HARM: "harm", // single target non-type damage
  HEAL: "heal", // restores health
  IDENTIFY: "identify",
  INFRAVISION: "infravision", // see in the dark
  INVISIBILITY: "invisibility",
  LEVITATE: "levitate",
  LIFT_CURSE: "lift curse",
  LIGHTNING: "lightning", // single target elec damage
  LOCATE_OBJECT: "locate object",
  MAGIC_MISSILE: "magic missile", // single target non-type damage
  MANASHIELD: "manashield",
  MASS_INVISIBILITY: "mass invisibility",
  MASS_LEVITATE: "mass levitate",
  MASS_REFRESH: "mass refresh",
  MINOR_CREATION: "minor creation",
  MIRAGE: "mirage", // increases armor
  MIRROR_IMAGES: "mirror images", // creates illusory copies of the caster that absorb 1 hit each and disappear
  ONE_HEART: "one heart", // totals remaining health of the party, then evenly redistributes it
  POISON: "poison",
  PROTECT: "protect", // halves all damage taken
  REFRESH: "refresh",
  RESIST_COLD: "resist cold",
  RESIST_ELECTRIC: "resist electric",
  RESIST_FIRE: "resist fire",
  RESURRECT: "resurrect",
  ROT: "rot", // reduces a fraction of target's currentHP, temporary STR debuff
  SCRY: "scry",
  SEE_INVISIBLE: "see invisible",
  SENSE_LIFE: "sense life",
  SENSE_PRESENCE: "sense presence",
  SHIELD: "shield", // increases armor (mage)
  SLEEP: "sleep",
  SPIRIT_ARMOR: "spirit armor", // reduces damage from opposite-spirit sources, degree determined by difference in spirit
  SPIRIT_BOLT: "spirit bolt", // minor, spirit-based damage
  SPIRIT_SHOCK: "spirit shock", // major, spirit-based damage
  STONE_SKIN: "stone skin", // increases armor (mage)
  STRENGTH: "strength",
  SUMMON: "summon",
  TELEPORT: "teleport", // teleports the party to the caster's last recall point
  THORNS: "thorns", // attackers take half the damage they deal
  TREMOR: "tremor", // multi-target non-typed damage
  VISIT: "visit", // magically moves the caster to the location of the target player
  WEAKEN: "weaken",
  WORD_OF_RECALL: "word of recall",
};

export const spells = Object.values(SPELL);

export default SPELL;
