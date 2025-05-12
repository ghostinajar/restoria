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
    return this._affixBonuses || calculateAffixBonuses(this);
})
    .set(function (value) {
    this._affixBonuses = value;
});
userSchema
    .virtual("currentHp")
    .get(function () {
    return this._currentHp ?? calculateMaxHp(this);
})
    .set(function (value) {
    this._currentHp = value;
});
userSchema.virtual("maxHp").get(function () {
    return calculateMaxHp(this);
});
userSchema.virtual("healthRegen").get(function () {
    return calculateHealthRegen(this);
});
userSchema
    .virtual("currentMp")
    .get(function () {
    return this._currentMp ?? calculateMaxMp(this);
})
    .set(function (value) {
    this._currentMp = value;
});
userSchema.virtual("maxMp").get(function () {
    return calculateMaxMp(this);
});
userSchema.virtual("manaRegen").get(function () {
    return calculateManaRegen(this);
});
userSchema
    .virtual("currentMv")
    .get(function () {
    return this._currentMv ?? calculateMaxMv(this);
})
    .set(function (value) {
    this._currentMv = value;
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
    return this._readyForAttack;
})
    .set(function (value) {
    this._readyForAttack = value;
});
userSchema
    .virtual("readyForAction")
    .get(function () {
    return this._readyForAction;
})
    .set(function (value) {
    this._readyForAction = value;
});
userSchema
    .virtual("readyForBonusAction")
    .get(function () {
    return this._readyForBonusAction;
})
    .set(function (value) {
    this._readyForBonusAction = value;
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    }
    catch (error) {
        catchErrorHandlerForFunction(`User.comparePassword for user id ${this._id}`, error);
    }
};
const User = model("User", userSchema);
export default User;
