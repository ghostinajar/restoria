import { Grudge } from "../../model/classes/Grudge.js";
import catchErrorHandlerForFunction from "../catchErrorHandlerForFunction.js";
import getRoomOfUser from "../getRoomOfUser.js";
import messageToUsername from "../messageToUsername.js";
import sendMessagePack from "../sendMessagePack.js";
import startWithCapitalLetter from "../startWithCapitalLetter.js";
async function resolveAttackHandler(attacker, defender, providedRoom) {
    try {
        // set target's combatTarget to attacker, add grudges
        if (!defender.combatTarget) {
            defender.combatEngage({
                id: attacker._id,
                name: attacker.name,
                type: attacker.agentType,
            });
        }
        // TODO replace these pushes with an addGrudge method on the agent which also checks to prevent duplicate grudges
        attacker.grudges.push(new Grudge(defender._id, defender.name, defender.agentType));
        defender.grudges.push(new Grudge(attacker._id, attacker.name, attacker.agentType));
        // prepare messagePack
        const messagePack = {};
        // pack any usernames present in the room into messagePack
        const attackerUser = attacker;
        if (attackerUser.username) {
            messagePack.agentUsername = attackerUser.username;
        }
        const defenderUser = defender;
        if (defenderUser.username) {
            messagePack.targetUsername = defenderUser.username;
        }
        let room = providedRoom ? providedRoom : await getRoomOfUser(attackerUser);
        if (room?.users && room.users.length > 1) {
            messagePack.observerUsernames = [];
            room.users.forEach((user) => {
                if (user.username !== attackerUser.username &&
                    user.username !== defenderUser.username &&
                    messagePack.observerUsernames) {
                    messagePack.observerUsernames.push(user.username);
                }
            });
        }
        //console.log(`messagePack after gathering users in room:`);
        //console.log(messagePack);
        // return failed PVP attempt
        // TODO revisit this when implementing PVP
        if (attackerUser.username && defenderUser.username) {
            messageToUsername(attackerUser.username, `Players can't attack players (PVP) in Restoria... yet.`);
            messageToUsername(defenderUser.username, `${attackerUser.name} tried to attack you, but Restoria doesn't allow PVP (yet).`);
            return;
        }
        // after this we know attacker or defender is a mob
        // roll hit vs ac
        const attackRoll = attacker.rollToHit();
        let hitSucceeds = attackRoll >= defender.armorClass;
        // console.log(
        //   `resolveAttackHandler: attackRoll ${attackRoll} vs defender.armorClass ${defender.armorClass}`
        // );
        // TODO after implementing skills: if successful dodge or parry roll, override hitSucceeds to false
        // if hit doesn't succeed, message users in room, return
        if (!hitSucceeds) {
            if (attackerUser.username) {
                // attacker is a user
                messagePack.messageForAgent = {
                    type: `attackMiss`,
                    content: `You attack ${defender.name} and miss.`,
                };
            }
            if (defenderUser.username) {
                // defender is a user
                messagePack.messageForTarget = {
                    type: `attackMiss`,
                    content: `${startWithCapitalLetter(attacker.name)} attacks you and misses.`,
                };
            }
            if (messagePack.observerUsernames) {
                // observers include users
                messagePack.messageForObservers = {
                    type: `attackMiss`,
                    content: `${attacker.name} attacks ${defender.name} and misses.`,
                };
            }
            // console.log(
            //   `resolveAttackHandler calling sendMessagePack with messagePack:`
            // );
            // console.log(messagePack);
            sendMessagePack(messagePack);
            return;
        }
        // TODO after implementing spells: if defender has mirror images, expend one, message users in room, return
        // after this we know the attack has hit
        // calculate grossDamage
        const grossDamage = attacker.rollWeaponDamage();
        if (!grossDamage) {
            throw new Error(`couldn't calculate gross damage with attacker.rollWeaponDamage`);
        }
        //console.log(`resolveAttackHandler got grossDamage ${grossDamage}`);
        // calculate netDamage (subtract defender resistances, spirit armor, protect)
        let netDamage = grossDamage;
        let resistanceMod = undefined;
        const damageType = attacker.equipped.weapon1?.weaponStats.damageType;
        if (damageType) {
            //console.log(`${attacker.name}'s weapon does ${damageType} type damage`);
            switch (damageType) {
                case "fire":
                    resistanceMod = defender.resistFire;
                    //console.log(`using fire resist of ${resistanceMod}`);
                    break;
                case "cold":
                    resistanceMod = defender.resistCold;
                    //console.log(`using cold resist of ${resistanceMod}`);
                    break;
                case "electric":
                    resistanceMod = defender.resistElec;
                    //console.log(`using elec resist of ${resistanceMod}`);
                    break;
                default:
                    //console.log(`not using resistance...`);
                    break;
            }
        }
        if (resistanceMod) {
            const reductionFromResistance = Math.round(netDamage * Math.min(0.5, resistanceMod * 0.05));
            // console.log(
            //   `resistance reduced netDamage by -${reductionFromResistance}`
            // );
            netDamage -= reductionFromResistance;
            //console.log(`netDamage after resistance: ${netDamage}`);
        }
        // TODO when spells are implemented, subtrack spirit armor & protect from netDamage
        // reduce defender's currentHealth
        defender.modifyHp(-netDamage);
        // message the room about damage
        if (attackerUser.username) {
            // attacker is a user
            messagePack.messageForAgent = {
                type: `attackMiss`,
                content: `Your attack hits ${defender.name} for ${netDamage} damage!`,
            };
        }
        if (defenderUser.username) {
            // defender is a user
            messagePack.messageForTarget = {
                type: `attackMiss`,
                content: `${startWithCapitalLetter(attacker.name)}'s attack hits you for ${netDamage} damage!`,
            };
        }
        if (messagePack.observerUsernames) {
            // observers include users
            messagePack.messageForObservers = {
                type: `attackMiss`,
                content: `${startWithCapitalLetter(attacker.name)}'s attack hits ${defender.name} for ${netDamage} damage!`,
            };
        }
        // console.log(
        //   `resolveAttackHandler calling sendMessagePack with messagePack:`
        // );
        //console.log(messagePack);
        sendMessagePack(messagePack);
        // TODO when spells implemented: if thorns, reduce attacker's currentHealth by netDamage / 2
    }
    catch (error) {
        catchErrorHandlerForFunction(`attackHandler`, error);
    }
}
export default resolveAttackHandler;
