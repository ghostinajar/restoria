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
import worldEmitter from "./WorldEmitter.js";
import { TICK_COOLDOWN } from "../../constants/COOLDOWNS.js";
import autoAttack from "../../util/autoAttack.js";
import messageToUsername from "../../util/messageToUsername.js";
import getRoomByLocation from "../../util/getRoomByLocation.js";
import relocateUser from "../../util/relocateUser.js";
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
    agentType: { type: String, required: true, default: "user" },
    location: {
        type: locationSchema,
        required: true,
        default: WORLD_RECALL,
    },
    shrine: {
        type: locationSchema,
        required: true,
        default: WORLD_RECALL,
    },
    pronouns: { type: Number, required: true, default: 3 },
    history: { type: historySchema, required: true },
    hoursPlayed: { type: Number, required: true, default: 0 },
    experience: { type: Number, required: true, default: 0 },
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
//****************************************************************************/
//                             Virtual Properties                             /
//****************************************************************************/
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
userSchema
    .virtual("currentHp")
    .get(function () {
    if (!this._currentHp) {
        this._currentHp = calculateMaxHp(this);
    }
    return this._currentHp;
})
    .set(function (value) {
    let maxPossible = calculateMaxHp(this);
    if (!maxPossible) {
        throw new Error(`calculateMaxHp failed for ${this.name}`);
    }
    this._currentHp = Math.min(value, maxPossible);
    if (this._currentHp < 0) {
        this._currentHp = 0;
    }
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
    if (!this._currentMp) {
        this._currentMp = calculateMaxMp(this);
    }
    return this._currentMp;
})
    .set(function (value) {
    let maxPossible = calculateMaxMp(this);
    if (!maxPossible) {
        throw new Error(`calculateMaxMp failed for ${this.name}`);
    }
    this._currentMp = Math.min(value, maxPossible);
    if (this._currentMp < 0) {
        this._currentMp = 0;
        // TODO handle consequences of zero currentMp
    }
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
    if (!this._currentMv) {
        this._currentMv = calculateMaxMv(this);
    }
    return this._currentMv;
})
    .set(function (value) {
    let maxPossible = calculateMaxMv(this);
    if (!maxPossible) {
        throw new Error(`calculateMaxMv failed for ${this.name}`);
    }
    this._currentMv = Math.min(value, maxPossible);
    if (this._currentMv < 0) {
        this._currentMv = 0;
        // TODO handle consequences of zero currentMv
    }
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
    .virtual("lastAttackActionDate")
    .get(function () {
    if (!this._lastAttackActionDate) {
        this._lastAttackActionDate = new Date();
    }
    return this._lastAttackActionDate;
})
    .set(function (value) {
    this._lastAttackActionDate = value;
});
userSchema
    .virtual("lastBonusActionDate")
    .get(function () {
    if (!this._lastBonusActionDate) {
        this._lastBonusActionDate = new Date();
    }
    return this._lastBonusActionDate;
})
    .set(function (value) {
    this._lastBonusActionDate = value;
});
userSchema
    .virtual("lastFullActionDate")
    .get(function () {
    if (!this._lastFullActionDate) {
        this._lastFullActionDate = new Date();
    }
    return this._lastFullActionDate;
})
    .set(function (value) {
    this._lastFullActionDate = value;
});
userSchema.virtual("readyForAttackAction").get(function () {
    return (new Date().getTime() - this.lastAttackActionDate.getTime() >= TICK_COOLDOWN);
});
userSchema.virtual("readyForFullAction").get(function () {
    return (new Date().getTime() - this.lastFullActionDate.getTime() >= TICK_COOLDOWN);
});
userSchema.virtual("readyForBonusAction").get(function () {
    return (new Date().getTime() - this.lastBonusActionDate.getTime() >= TICK_COOLDOWN);
});
userSchema
    .virtual("combatTarget")
    .get(function () {
    return this._combatTarget || undefined;
})
    .set(function (value) {
    this._combatTarget = value;
});
userSchema.virtual("grudges").get(function () {
    if (!this._grudges) {
        this._grudges = [];
    }
    return this._grudges;
});
userSchema.virtual("lootBags").get(function () {
    if (!this._lootBags) {
        this._lootBags = [];
    }
    return this._lootBags;
});
userSchema
    .virtual("resting")
    .get(function () {
    return this._resting;
})
    .set(function (value) {
    this._resting = value;
});
userSchema
    .virtual("fainted")
    .get(function () {
    return this._fainted;
})
    .set(function (value) {
    this._fainted = value;
});
//****************************************************************************/
//                             Methods                                        /
//****************************************************************************/
userSchema.methods.modifyHp = function (amount) {
    try {
        const newHp = Math.min(Math.round(this.currentHp + amount), this.maxHp);
        this.currentHp = Math.max(0, newHp);
        if (this.currentHp < 1) {
            this.faint();
        }
        this.updateHUD();
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSchema.methods.modifyHp`, error, this.name);
    }
};
userSchema.methods.modifyMp = function (amount) {
    try {
        const newMp = Math.min(Math.round(this._currentMp + amount), this.maxMp);
        this._currentMp = Math.max(0, newMp);
        this.updateHUD();
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSchema.methods.modifyMp`, error, this.name);
    }
};
userSchema.methods.modifyMv = function (amount) {
    try {
        const newMv = Math.min(Math.round(this._currentMv + amount), this.maxMv);
        this._currentMv = Math.max(0, newMv);
        this.updateHUD();
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSchema.methods.modifyMv`, error, this.name);
    }
};
userSchema.methods.rollToHit = function () {
    try {
        const d20result = rollDice("1d20");
        //console.log(`user.rollToHit returning ${d20result + this.hitBonus}`);
        return d20result + this.hitBonus;
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSchema.methods.rollToHit`, error, this.name);
        return 0;
    }
};
userSchema.methods.rollWeaponDamage = function () {
    try {
        // handle unarmed
        if (!this.equipped.weapon1 || !this.equipped.weapon1.weaponStats) {
            //console.log(`${this.name} is rolling unarmed damage`);
            let unarmedRoll = rollDice("1d4");
            if (!unarmedRoll) {
                unarmedRoll = 1;
            }
            const damageResult = Math.max(0, unarmedRoll + this.damageBonus);
            //console.log(`${this.name} rolled ${damageResult}`);
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
        //console.log(`${this.name} is rolling damage with a weapon`);
        const damageResult = Math.max(0, diceResult + this.damageBonus);
        //console.log(`${this.name} rolled ${damageResult}`);
        return damageResult;
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSchema.methods.rollWeaponDamage`, error, this.name);
        return 0;
    }
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
    try {
        if (this.fainted) {
            this.deathSave();
            return;
        }
        // Health regeneration
        if (this.currentHp < this.maxHp && this.resting) {
            this.modifyHp(Math.max(0, this.maxHp / this.healthRegen));
        }
        // Mana regeneration
        if (this.currentMp < this.maxMp && this.resting) {
            this.modifyMp(Math.max(0, this.maxMp / this.manaRegen));
        }
        // Movement regeneration
        if (this.currentMv < this.maxMv && this.resting) {
            this.modifyMv(Math.max(0, this.maxMv / this.moveRegen));
        }
        // autoAttack combat target
        if (this.readyForAttackAction && this.combatTarget) {
            autoAttack(this);
        }
        await this.save();
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSchema.methods.handleTick`, error, this.name);
    }
};
userSchema.methods.combatDisengage = function () {
    this.combatTarget = undefined;
    this.updateHUD();
};
userSchema.methods.combatEngage = function (target) {
    this.combatTarget = target;
    this.updateHUD();
};
userSchema.methods.updateHUD = function () {
    try {
        const now = new Date().getTime();
        const attackCooldown = Math.max(0, TICK_COOLDOWN - (now - this.lastAttackActionDate.getTime()));
        const bonusCooldown = Math.max(0, TICK_COOLDOWN - (now - this.lastBonusActionDate.getTime()));
        const fullCooldown = Math.max(0, TICK_COOLDOWN - (now - this.lastFullActionDate.getTime()));
        const hudUpdatePackage = {
            currentHp: this.currentHp,
            maxHp: this.maxHp,
            currentMp: this.currentMp,
            maxMp: this.maxMp,
            currentMv: this.currentMv,
            maxMv: this.maxMv,
            attackCooldown: attackCooldown,
            bonusCooldown: bonusCooldown,
            fullCooldown: fullCooldown,
            combatTargetName: this.combatTarget?.name,
        };
        worldEmitter.emit(`hudUpdateFor${this.username}`, hudUpdatePackage);
        return;
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSchema.methods.updateHud`, error);
    }
};
userSchema.methods.faint = async function () {
    try {
        // disengage, faint
        this.combatDisengage();
        this.fainted = true;
        // message user
        const user = this;
        messageToUsername(user.username, `You fainted!`, `red`);
        // handle users in room (message/disengage/degrudge)
        const room = await getRoomByLocation(this.location);
        if (!room) {
            throw new Error(`Failed to find room for user ${this.name}!`);
        }
        room.users.forEach((u) => {
            // message
            messageToUsername(u.username, `${this.name} fainted!`, `red`);
            // disengage
            if (u.combatTarget?.id === this._id) {
                u.combatDisengage();
            }
            // degrudge
            u.grudges = u.grudges.filter((grudge) => {
                return grudge.targetId !== this._id;
            });
        });
        // handle mobs in room (disengage/degrudge)
        room.mobs.forEach((m) => {
            // disengage
            if (m.combatTarget?.id === this._id) {
                m.combatDisengage();
            }
            // degrudge
            m.grudges = m.grudges.filter((grudge) => {
                return grudge.targetId !== this._id;
            });
        });
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSchema.methods.faint`, error, this.name);
    }
};
userSchema.methods.revive = function () {
    const user = this;
    messageToUsername(user.username, `Your author's spirit revives you. How lucky!`, `success`);
    this.fainted = false;
    this.deathSaveTries = 0;
    this.deathSaveSuccesses = 0;
    this.currentHp = 1;
    this.currentMp = 1;
    this.currentMv = 1;
    this.updateHUD();
};
userSchema.methods.gainXp = function (xp) {
    this.experience += xp;
    if (this.experience < 0) {
        this.experience = 0;
    }
    messageToUsername(this.username, `You gained ${xp}xp!`, `success`);
};
userSchema.methods.gainLootBag = function (lb) {
    if (this.lootBags.length > 100) {
        const oldLoot = this.lootBags.pop();
        messageToUsername(this.username, `You have too many loot bags! Read HELP LOOT. The oldest one will have to go...`, `red_light`);
        messageToUsername(this.username, `Your loot from ${oldLoot.fromName} scatters in a cloud of spectral letters and words.`, `item`);
    }
    this.lootBags.push(lb);
    const user = this;
    messageToUsername(user.username, `You got a loot bag from ${lb.fromName}!`, `success`);
};
userSchema.methods.addGrudge = function (g) {
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
};
userSchema.methods.deathSave = function () {
    console.log(`${this.name} is doing a death save...`);
    this.deathSaveTries++;
    console.log(`This is try ${this.deathSaveTries}`);
    // If this is more than 3 tries, relocate and revive
    if (this.deathSaveTries >= 3) {
        console.log(`More than 3 tries! relocating and reviving...`);
        const user = this;
        relocateUser(user, this.shrine);
        this.revive();
        return;
    }
    // Make the save roll
    const constitution = this.statBlock.constitution || 10;
    let chance = 0.5 + (constitution - 10) * 0.02;
    console.log(`Base chance: ${chance}`);
    chance = Math.max(0.5, Math.min(0.7, chance)); // Clamp between 50% and 70%
    console.log(`Chance after rando: ${chance}`);
    if (Math.random() < chance) {
        this.deathSaveSuccesses++;
        console.log(`That's ${this.deathSaveSuccesses} successes!`);
    }
    // Check if we've succeeded three times
    if (this.deathSaveSuccesses >= 3) {
        console.log(`3 successes! Reviving...`);
        this.revive();
        return;
    }
};
const User = model("User", userSchema);
export default User;
