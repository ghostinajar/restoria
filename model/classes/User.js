// User
// Class and schema for User objects and documents
// Also allows state management for an active user instance
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import affixSchema from "./Affix.js";
import itemSchema from "./Item.js";
import descriptionSchema from "./Description.js";
import locationSchema from "./Location.js";
import statBlockSchema from "./StatBlock.js";
import historySchema from "./History.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";
import WORLD_RECALL from "../../constants/WORLD_RECALL.js";
import { calculateMaxHp, calculateMaxMp, calculateMaxMv, calculateStrength, calculateDexterity, calculateConstitution, calculateIntelligence, calculateWisdom, calculateCharisma, calculateDamageBonus, calculateHitBonus, calculateArmorClass, calculateSpellSave, calculateSpeed, calculateResistCold, calculateResistFire, calculateResistElec, calculateHealthRegen, calculateManaRegen, calculateMoveRegen, } from "../../constants/BASE_STATS.js";
import calculateAffixBonuses from "../../util/calculateAffixBonuses.js";
import rollDice from "../../util/rollDice.js";
import resolveQueuedAction from "../../util/resolveQueuedAction.js";
const { Schema, Types, model } = mongoose;
export const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // as a salted hash
    salt: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    author: {
        type: Schema.Types.ObjectId,
        default: null,
    },
    location: {
        type: locationSchema,
        required: true,
        default: WORLD_RECALL,
    },
    pronouns: { type: Number, required: true, default: 3 },
    history: { type: historySchema, required: true },
    hoursPlayed: { type: Number, required: true, default: 0 },
    job: { type: String, required: true, default: "cleric" },
    level: { type: Number, required: true, default: 1 },
    statBlock: { type: statBlockSchema, required: true, default: () => ({}) },
    goldHeld: { type: Number, required: true, default: 0 },
    goldBanked: { type: Number, required: true, default: 0 },
    trainingPoints: { type: Number, required: true, default: 0 },
    jobLevels: {
        type: {
            cleric: { type: Number, required: true, default: 0 },
            mage: { type: Number, required: true, default: 0 },
            rogue: { type: Number, required: true, default: 0 },
            warrior: { type: Number, required: true, default: 0 },
        },
        required: true,
    },
    description: {
        type: descriptionSchema,
        required: true,
        default: () => ({}),
    },
    unpublishedZoneTally: { type: Number, required: true, default: 0 },
    trained: {
        type: [{ name: String, level: Number }],
        required: true,
        default: () => [],
    },
    inventory: { type: [itemSchema], required: true, default: () => [] },
    capacity: { type: Number, required: true, default: 30 },
    storage: { type: [itemSchema], required: true, default: () => [] },
    equipped: {
        type: {
            arms: { type: itemSchema, default: null },
            body: { type: itemSchema, default: null },
            ears: { type: itemSchema, default: null },
            feet: { type: itemSchema, default: null },
            finger1: { type: itemSchema, default: null },
            finger2: { type: itemSchema, default: null },
            hands: { type: itemSchema, default: null },
            head: { type: itemSchema, default: null },
            held: { type: itemSchema, default: null },
            legs: { type: itemSchema, default: null },
            neck: { type: itemSchema, default: null },
            shield: { type: itemSchema, default: null },
            shoulders: { type: itemSchema, default: null },
            waist: { type: itemSchema, default: null },
            wrist1: { type: itemSchema, default: null },
            wrist2: { type: itemSchema, default: null },
            weapon1: { type: itemSchema, default: null },
            weapon2: { type: itemSchema, default: null },
        },
        required: true,
    },
    affixes: {
        type: [{ type: affixSchema, required: true, default: () => ({}) }],
        required: true,
        default: () => [],
    },
    editor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    preferences: {
        type: {
            autoExamine: { type: Boolean, required: true, default: true },
            mapRadius: { type: Number, required: true, default: 8 },
            autoMap: { type: Boolean, required: true, default: true },
        },
        required: true,
        default: () => ({ autoExamine: false, mapRadius: 8, autoMap: true }),
    },
    _currentHp: Number,
    _currentMp: Number,
    _currentMv: Number,
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
userSchema
    .virtual("affixBonuses")
    .get(function () {
    if (this._affixBonuses) {
        return this._affixBonuses;
    }
    calculateAffixBonuses(this);
    return this._affixBonuses;
})
    .set(function (value) {
    this._affixBonuses = value;
});
userSchema.virtual("currentHp").get(function () {
    return this._currentHp ?? calculateMaxHp(this);
});
userSchema.virtual("maxHp").get(function () {
    return calculateMaxHp(this);
});
userSchema.virtual("healthRegen").get(function () {
    return calculateHealthRegen(this);
});
userSchema.virtual("currentMp").get(function () {
    return this._currentMp ?? calculateMaxMp(this);
});
userSchema.virtual("maxMp").get(function () {
    return calculateMaxMp(this);
});
userSchema.virtual("manaRegen").get(function () {
    return calculateManaRegen(this);
});
userSchema.virtual("currentMv").get(function () {
    return this._currentMv ?? calculateMaxMv(this);
});
userSchema.virtual("maxMv").get(function () {
    return calculateMaxMv(this);
});
userSchema.virtual("moveRegen").get(function () {
    return calculateMoveRegen(this);
});
userSchema.virtual("strength").get(function () {
    return calculateStrength(this);
});
userSchema.virtual("dexterity").get(function () {
    return calculateDexterity(this);
});
userSchema.virtual("constitution").get(function () {
    return calculateConstitution(this);
});
userSchema.virtual("intelligence").get(function () {
    return calculateIntelligence(this);
});
userSchema.virtual("wisdom").get(function () {
    return calculateWisdom(this);
});
userSchema.virtual("charisma").get(function () {
    return calculateCharisma(this);
});
userSchema.virtual("damageBonus").get(function () {
    return calculateDamageBonus(this);
});
userSchema.virtual("hitBonus").get(function () {
    return calculateHitBonus(this);
});
userSchema.virtual("armorClass").get(function () {
    return calculateArmorClass(this);
});
userSchema.virtual("spellSave").get(function () {
    return calculateSpellSave(this);
});
userSchema.virtual("speed").get(function () {
    return calculateSpeed(this);
});
userSchema.virtual("resistCold").get(function () {
    return calculateResistCold(this);
});
userSchema.virtual("resistFire").get(function () {
    return calculateResistFire(this);
});
userSchema.virtual("resistElec").get(function () {
    return calculateResistElec(this);
});
userSchema
    .virtual("readyForAttack")
    .get(function () {
    return this._readyForAttack === undefined ? true : this._readyForAttack;
})
    .set(function (value) {
    this._readyForAttack = value;
});
userSchema
    .virtual("readyForAction")
    .get(function () {
    return this._readyForAction === undefined ? true : this._readyForAction;
})
    .set(function (value) {
    this._readyForAction = value;
});
userSchema
    .virtual("readyForBonusAction")
    .get(function () {
    return this._readyForBonusAction === undefined
        ? true
        : this._readyForBonusAction;
})
    .set(function (value) {
    this._readyForBonusAction = value;
});
userSchema.virtual("actionQueue").get(function () {
    return this._actionQueue || [];
});
userSchema.virtual("bonusActionQueue").get(function () {
    return this._bonusActionQueue || [];
});
userSchema
    .virtual("combatTargetId")
    .get(function () {
    return this._combatTargetId || undefined;
})
    .set(function (value) {
    this._combatTargetId = value;
});
userSchema
    .virtual("combatTargetName")
    .get(function () {
    return this._combatTargetName || undefined;
})
    .set(function (value) {
    this._combatTargetName = value;
});
userSchema.virtual("grudges").get(function () {
    return this._grudges || [];
});
userSchema.methods.modifyHp = function (amount) {
    const newHp = Math.min(this._currentHp + amount, this.maxHp);
    this._currentHp = Math.max(0, newHp);
};
userSchema.methods.modifyMp = function (amount) {
    const newMp = Math.min(this._currentMp + amount, this.maxMp);
    this._currentMp = Math.max(0, newMp);
};
userSchema.methods.modifyMv = function (amount) {
    const newMv = Math.min(this._currentMv + amount, this.maxMv);
    this._currentMv = Math.max(0, newMv);
};
userSchema.methods.rollToHit = function () {
    const d20result = rollDice("1d20");
    console.log(`user.rollToHit returning ${d20result + this.hitBonus}`);
    return d20result + this.hitBonus;
};
userSchema.methods.rollWeaponDamage = function () {
    // handle unarmed
    if (!this.equipped.weapon1 || !this.equipped.weapon1.weaponStats) {
        console.log(`${this.name} is rolling unarmed damage`);
        let unarmedRoll = rollDice("1d4");
        if (!unarmedRoll) {
            unarmedRoll = 1;
        }
        const damageResult = Math.max(0, unarmedRoll + this.damageBonus);
        console.log(`${this.name} rolled ${damageResult}`);
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
    console.log(`${this.name} is rolling damage with a weapon`);
    const damageResult = Math.max(0, diceResult + this.damageBonus);
    console.log(`${this.name} rolled ${damageResult}`);
    return damageResult;
};
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    }
    catch (error) {
        catchErrorHandlerForFunction(`User.comparePassword for user id ${this._id}`, error);
    }
};
userSchema.methods.handleTick = async function () {
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
        this._actionQueue = this.actionQueue.slice(1);
        await resolveQueuedAction(nextAction);
    }
    if (this.bonusActionQueue && this.bonusActionQueue.length > 0) {
        const nextBonusAction = this.bonusActionQueue[0];
        this._bonusActionQueue = this._bonusActionQueue.slice(1);
        await resolveQueuedAction(nextBonusAction);
    }
    await this.save();
};
const User = model("User", userSchema);
export default User;
