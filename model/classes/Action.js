// Action
// a class to define actions (whether full Action, attack, or bonus action) done by agents (user, mob, etc.)
// to be executed or added to action queues
import SKILL from "../../constants/SKILL.js";
import SPELL from "../../constants/SPELL.js";
const actionNames = [
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
    SPELL.FATIGUE,
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
];
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
    SPELL.CURE_FATIGUE,
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
class Action {
    constructor(agentId, agentType, agentName, targetId, targetType, targetName, actionName) {
        this.agentId = agentId;
        this.agentType = agentType;
        this.agentName = agentName;
        this.targetType = targetType;
        this.targetId = targetId;
        this.targetName = targetName;
        this.actionName = actionName;
        this.dateEntered = new Date();
        this.actionLabel = `${actionName} ${targetName}`;
    }
    agentId;
    agentType;
    agentName;
    targetId;
    targetType;
    targetName;
    actionName;
    dateEntered;
    actionLabel;
}
export default Action;
