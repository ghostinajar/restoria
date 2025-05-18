const SPELL = {
    NONE: "none", // this entry only exists for dropdown in item form
    ARCANE_EYE: "arcane eye", // shows a wide map of wilderness including number of mobs in each room
    ATTUNE: "attune", // inscribe location to an attunable item (allows USE item later to warp to location)
    BERSERK: "berserk", // causes a mob or player to follow themself (unfollowing others, or disbanding the group if they are the leader)
    BLESS: "bless", // temporary bonus to hb and ss
    BLIND: "blind", // temporary penalty to hb and ac
    BLINK: "blink", // relocates user to a random wilderness location nearby
    BLIZZARD: "blizzard", // multi-target cold damage
    BLOOD_MAGIC: "blood magic", // removes 5 or more levels of blood from the room, healing the party proportionately
    BREADCRUMBS: "breadcrumbs", // leaves a magical trace of the caster wherever they go, indicating how many times they have entered a room
    BREATHE_WATER: "breathe water", // prevent drowning damage
    BUBBLE: "bubble", // prevents mobs from entering the room
    CHARM: "charm", // on success, mob joins user's party and is only aggressive to those targeting user or itself
    COLD: "cold", // single target cold damage
    COLOR_SPRAY: "color spray", // moderate non-elem damage, chance to blind
    CONJURE_ELEMENTAL: "conjure elemental", // consumes reagent(s), elemental joins user's party as a charmed mob
    CREATE_FOOD: "create food", // puts food items in users inventory
    CREATE_WATER: "create water", // fills liquid container target with water
    CURE_BLIND: "cure blind", // removes blind affix from target
    CURE_POISON: "cure poison", // remove poison affix from target
    CURSE: "curse", // temporary penalty to hb and ss
    DIMENSION_DOOR: "dimension door", // move magically through an exit, even when closed/locked
    DISCERN_SPIRIT: "discern spirit", // see the spirit of creatures and players on their description
    DISINTEGRATE: "disintegrate", // big, solo non-elem damage
    DISPEL_MAGIC: "dispel magic", // removes some positive affix(es) from target
    DRAIN: "drain", // moderate non-elem damage, heals users for same amount
    ECHO_SPIRIT: "echo spirit", // reveal all hidden beings in a room
    FAERIE_FIRE: "faerie fire", // small reduction to AC
    FARSIGHT: "farsight", // shows user mobs & users up to 5 rooms in a straight line in one direction
    FEAR: "fear", // causes mob to flee the room
    FIRE: "fire", // single target fire damage
    FIRESTORM: "firestorm", // multi-target fire damage
    GATE: "gate", // ?? maybe returns whole party to recall
    HARM: "harm", // single target non-type damage
    HEAL: "heal", // restores health
    IDENTIFY: "identify", // shows detailed stats of an item or mob
    INFRAVISION: "infravision", // see in the dark
    INVISIBILITY: "invisibility", // target agent doesn't provoke aggro from mobs
    LEVITATE: "levitate", // target agent can travel over water
    LIFT_CURSE: "lift curse", // remove curse affix from target agent
    LIGHTNING: "lightning", // single target elec damage
    LOCATE_OBJECT: "locate object", // confirms presence and location of item with target keyword
    MAGIC_MISSILE: "magic missile", // single target non-type damage
    MANASHIELD: "manashield", // causes self to take mana damage in place of health damage, until <10% mana
    MASS_INVISIBILITY: "mass invisibility", // everyone in room becomes invisible
    MASS_LEVITATE: "mass levitate", // everyone in room levitates
    MASS_REFRESH: "mass refresh", // everyone in room recovers mv points
    MINOR_CREATION: "minor creation", // creates a waterskin, paper, quill, torch, bag, trap, or raft
    MIRAGE: "mirage", // increases AC
    MIRROR_IMAGES: "mirror images", // creates illusory copies of the caster that absorb 1 hit each and disappear
    ONE_HEART: "one heart", // totals remaining health of the party, then evenly redistributes it
    POISON: "poison", // minor damage and affix reduces hb
    PROTECT: "protect", // halves all damage taken
    REFRESH: "refresh", // target recovers mv points
    RESIST_COLD: "resist cold", // reduces cold damage
    RESIST_ELECTRIC: "resist electric", // reduces elec damage
    RESIST_FIRE: "resist fire", // reduces fire damage
    RESURRECT: "resurrect", // removes death from a target
    ROT: "rot", // reduces a fraction of target's currentHP, temporary STR debuff
    SCRY: "scry", // view the inventory of nearby creature with target keyword
    SEE_INVISIBLE: "see invisible", // allows user to see and attack invisible targets
    SENSE_LIFE: "sense life", // indicates how many invisible and/or hidden targets are in the room with user
    SENSE_PRESENCE: "sense presence", // gives a yes/no to caster that an agent with target keyword is nearby
    SHIELD: "shield", // increases armor (mage)
    SLEEP: "sleep", // target goes to sleep
    SPIRIT_ARMOR: "spirit armor", // reduces damage from opposite-spirit sources, degree determined by difference in spirit
    SPIRIT_BOLT: "spirit bolt", // minor, spirit-based damage
    SPIRIT_SHOCK: "spirit shock", // major, spirit-based damage
    STONE_SKIN: "stone skin", // increases armor (mage)
    STRENGTH: "strength", // increase target STR
    SUMMON: "summon", // relocate's a nearby target to the caster's room
    TELEPORT: "teleport", // teleports the party to the caster's last recall point
    THORNS: "thorns", // attackers take half the damage they deal
    TREMOR: "tremor", // multi-target non-typed damage
    VISIT: "visit", // magically moves the caster to the location of the target player
    WEAKEN: "weaken", // reduces target STR
    WORD_OF_RECALL: "word of recall", // relocates caster to most recently visited recall point
};
export const spells = Object.values(SPELL);
export default SPELL;
