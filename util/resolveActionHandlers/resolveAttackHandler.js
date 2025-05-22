import catchErrorHandlerForFunction from "../catchErrorHandlerForFunction.js";
import getRoomOfUser from "../getRoomOfUser.js";
import sendMessagePack from "../sendMessagePack.js";
import startWithCapitalLetter from "../startWithCapitalLetter.js";
async function resolveAttackHandler(attacker, defender, providedRoom) {
    try {
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
        if (room?.users && room.users.length > 0) {
            messagePack.observerUsernames = [];
            room.users.forEach((user) => {
                if (user.username !== attackerUser.username &&
                    user.username !== defenderUser.username &&
                    messagePack.observerUsernames) {
                    messagePack.observerUsernames.push(user.username);
                }
            });
        }
        console.log(`messagePack after gathering users in room:`);
        console.log(messagePack);
        // roll hit vs ac
        const attackRoll = attacker.rollToHit();
        let hitSucceeds = attackRoll >= defender.armorClass;
        console.log(`resolveAttackHandler: attackRoll ${attackRoll} vs defender.armorClass ${defender.armorClass}`);
        if (hitSucceeds) {
            console.log(`hitSucceeds = ${hitSucceeds} so far!`);
            // TODO after implementing skills: if successful dodge or parry roll, override hitSucceeds to false
        }
        // return failed PVP attempt
        // TODO revisit this when implementing PVP
        // if (attackerUser.username && defenderUser.username) {
        //   messageToUsername(
        //     attackerUser.username,
        //     `Players can't attack players (PVP) in Restoria... yet.`
        //   );
        //   messageToUsername(
        //     defenderUser.username,
        //     `${attackerUser.name} tried to attack you, but Restoria doesn't allow PVP (yet).`
        //   );
        //   return;
        // }
        // after this we know attacker or defender is a mob
        // if !hitSucceeds, message users in room, return
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
            console.log(`resolveAttackHandler calling sendMessagePack with messagePack:`);
            console.log(messagePack);
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
        console.log(`resolveAttackHandler got grossDamage ${grossDamage}`);
        // calculate netDamage (subtract defender resistances, spirit armor, protect)
        // reduce defender's currentHealth
        // if thorns, reduce attacker's currentHealth by netDamage / 2
    }
    catch (error) {
        catchErrorHandlerForFunction(`attackHandler`, error);
    }
}
export default resolveAttackHandler;
