import mongoose from "mongoose";
import { calculateArmorClass, calculateCharisma, calculateConstitution, calculateDamageBonus, calculateDexterity, calculateHealthRegen, calculateHitBonus, calculateIntelligence, calculateManaRegen, calculateMaxHp, calculateMaxMp, calculateMaxMv, calculateMoveRegen, calculateResistCold, calculateResistElec, calculateResistFire, calculateSpeed, calculateSpellSave, calculateStrength, calculateWisdom, } from "../../constants/BASE_STATS.js";
import { AFFIX_BONUSES } from "../../constants/AFFIX_BONUSES.js";
import rollDice from "../../util/rollDice.js";
import calculateAffixBonuses from "../../util/calculateAffixBonuses.js";
import { TICK_COOLDOWN } from "../../constants/COOLDOWNS.js";
import autoAttack from "../../util/autoAttack.js";
import getRoomByLocation from "../../util/getRoomByLocation.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";
import combatTargetIsInRoom from "../../util/combatTargetIsInRoom.js";
import messageToUsername from "../../util/messageToUsername.js";
import { XP_REWARD_FOR_MONSTER_LEVEL } from "../../constants/XP.js";
class Mob {
    constructor(blueprint, location) {
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
        this.resting = false;
    }
    _id;
    author;
    name;
    agentType;
    location;
    pronouns;
    level;
    job;
    statBlock;
    goldHeld;
    isUnique;
    isMount;
    isAggressive;
    chattersToPlayer;
    emotesToPlayer;
    description;
    keywords;
    affixes;
    equipped;
    chatters;
    emotes;
    inventory;
    capacity;
    affixBonuses;
    currentHp;
    maxHp;
    healthRegen;
    currentMp;
    maxMp;
    manaRegen;
    currentMv;
    maxMv;
    moveRegen;
    strength;
    dexterity;
    constitution;
    intelligence;
    wisdom;
    charisma;
    speed;
    hitBonus;
    damageBonus;
    armorClass;
    resistCold;
    resistElec;
    resistFire;
    spellSave;
    lastAttackActionDate;
    lastBonusActionDate;
    lastFullActionDate;
    combatTarget;
    grudges;
    resting;
    get nameCapitalized() {
        return `${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`;
    }
    get readyForAttackAction() {
        return (new Date().getTime() - this.lastAttackActionDate.getTime() >=
            TICK_COOLDOWN);
    }
    get readyForFullAction() {
        return (new Date().getTime() - this.lastFullActionDate.getTime() >= TICK_COOLDOWN);
    }
    get readyForBonusAction() {
        return (new Date().getTime() - this.lastBonusActionDate.getTime() >= TICK_COOLDOWN);
    }
    //****************************************************************************/
    //                             Methods                                        /
    //****************************************************************************/
    async handleTick() {
        try {
            // Health regeneration
            if (this.currentHp < this.maxHp && this.resting) {
                this.modifyHp(Math.max(0, this.maxHp * this.healthRegen * 0.01));
            }
            // Mana regeneration
            if (this.currentMp < this.maxMp && this.resting) {
                this.modifyMp(Math.max(0, this.maxMp / this.manaRegen));
            }
            // Movement regeneration
            if (this.currentMv < this.maxMv && this.resting) {
                this.modifyMv(Math.max(0, this.maxMv / this.moveRegen));
            }
            // target a grudge if they're present in the room
            if (this.grudges.length > 0 && !this.combatTarget) {
                const room = await getRoomByLocation(this.location);
                if (!room) {
                    throw new Error(`Couldn't find room for user ${this._id} ${this.name}`);
                }
                for (const grudge of this.grudges) {
                    const potentialTarget = {
                        name: grudge.targetName,
                        id: grudge.targetId,
                        type: grudge.targetType,
                    };
                    if (combatTargetIsInRoom(room, potentialTarget)) {
                        this.combatEngage(potentialTarget);
                        if (potentialTarget.type === "user") {
                            messageToUsername(potentialTarget.name.toLowerCase(), `${this.nameCapitalized} remembers a grudge and targets you!`, `red`);
                        }
                        break;
                    }
                }
            }
            // if no combat target and mob is aggro, set combat target to random user in room
            if (this.isAggressive && !this.combatTarget) {
                const room = await getRoomByLocation(this.location);
                if (!room) {
                    throw new Error(`mob.handleTick had trouble getting room for mob id ${this._id}`);
                }
                const consciousUsers = room.users.filter((u) => {
                    return !u.fainted;
                });
                if (consciousUsers.length > 0) {
                    const randomUser = room.users[Math.floor(Math.random() * room.users.length)];
                    this.combatTarget = {
                        id: randomUser._id,
                        name: randomUser.name,
                        type: "user",
                    };
                }
            }
            // autoAttack combat target
            if (this.readyForAttackAction && this.combatTarget) {
                autoAttack(this);
            }
        }
        catch (error) {
            catchErrorHandlerForFunction(`mob.handleTick`, error, this.name);
        }
    }
    modifyHp(amount) {
        try {
            const newHp = Math.min(Math.round(this.currentHp + amount), this.maxHp);
            this.currentHp = Math.max(0, newHp);
            // faint if reduced below 1
            if (this.currentHp < 1) {
                this.faint();
            }
        }
        catch (error) {
            catchErrorHandlerForFunction(`mob.modifyHp`, error, this.name);
            return 0;
        }
    }
    modifyMp(amount) {
        try {
            const newMp = Math.min(Math.round(this.currentMp + amount), this.maxMp);
            this.currentMp = Math.max(0, newMp);
        }
        catch (error) {
            catchErrorHandlerForFunction(`mob.modifyMp`, error, this.name);
            return 0;
        }
    }
    modifyMv(amount) {
        try {
            const newMv = Math.min(Math.round(this.currentMv + amount), this.maxMv);
            this.currentMv = Math.max(0, newMv);
        }
        catch (error) {
            catchErrorHandlerForFunction(`mob.modifyMv`, error, this.name);
            return 0;
        }
    }
    rollToHit() {
        try {
            const d20result = rollDice("1d20");
            return d20result ? d20result + this.hitBonus : 0;
        }
        catch (error) {
            catchErrorHandlerForFunction(`mob.rollToHit`, error, this.name);
            return 0;
        }
    }
    rollWeaponDamage() {
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
            const diceString = this.equipped.weapon1.weaponStats.damageDieQuantity &&
                this.equipped.weapon1.weaponStats.damageDieSides
                ? `${this.equipped.weapon1.weaponStats.damageDieQuantity}d${this.equipped.weapon1.weaponStats.damageDieSides}`
                : `1d4`;
            const diceResult = rollDice(diceString);
            if (!diceResult)
                return this.damageBonus;
            const damageResult = Math.max(0, diceResult + this.damageBonus);
            return damageResult;
        }
        catch (error) {
            catchErrorHandlerForFunction(`mob.rollWeaponDamage`, error, this.name);
            return 0;
        }
    }
    combatDisengage() {
        this.combatTarget = undefined;
    }
    combatEngage(target) {
        this.combatTarget = target;
    }
    async faint() {
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
                messageToUsername(u.username, `${this.nameCapitalized} fainted!`, `red`);
                // reward users in the room also on mob's grudge list
                if (this.grudges.some((grudge) => grudge.targetName === u.name)) {
                    const xpReward = XP_REWARD_FOR_MONSTER_LEVEL[this.level];
                    u.gainXp(xpReward);
                    const lootBag = this.generateLootBag();
                    u.gainLootBag(lootBag);
                }
            });
            room.mobs.forEach((m) => {
                // disengage mobs targeting this mob
                if (m.combatTarget?.id === this._id) {
                    m.combatDisengage();
                }
            });
            room.destroyMob(this);
        }
        catch (error) {
            catchErrorHandlerForFunction(`mob.faint`, error, this.name);
        }
    }
    generateLootBag() {
        const lb = {
            fromName: this.name,
            items: [],
            gold: 0,
        };
        // add items to items array
        this.inventory.forEach((i) => {
            if (Math.random() < 0.5) {
                lb.items.push(i);
            }
        });
        // tweak gold amount
        lb.gold = XP_REWARD_FOR_MONSTER_LEVEL[this.level];
        return lb;
    }
    addGrudge(g) {
        // remove duplicate if it exists
        this.grudges = this.grudges.filter((grudge) => !(grudge.targetId === g.targetId &&
            grudge.targetName === g.targetName &&
            grudge.targetType === g.targetType));
        // put the grudge at the top
        this.grudges.unshift(g);
        // if there are more than 10 grudges, remove anything after
        if (this.grudges.length > 10) {
            this.grudges = this.grudges.slice(0, 10);
        }
    }
}
export default Mob;
