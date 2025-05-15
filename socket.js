// socket
// organizes messages to and from client sockets
import logger from "./logger.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import makeMessage from "./util/makeMessage.js";
import authenticateSessionUserOnSocket from "./util/authenticateSessionUserOnSocket.js";
import disconnectMultiplayerOnSocket from "./util/disconnectMultiplayerOnSocket.js";
import setupUserOnSocket from "./util/setupUserOnSocket.js";
import userSentCommandHandler from "./util/userSentCommandHandler.js";
import { formPromptForUserHandler, mapRequestForUserHandler, messageArrayForUserHandler, messageForUserHandler, messageForUsersRoomHandler, messageForUsersZoneHandler, userSubmittedCreateItemBlueprintHandler, userSubmittedEditItemBlueprintHandler, userSubmittedEditMobBlueprintHandler, userSubmittedEditRoomHandler, userSubmittedEditZoneHandler, userSubmittedEraseItemBlueprintHandler, userSubmittedEraseMobBlueprintHandler, userSubmittedEraseRoomHandler, userSubmittedGotoHandler, userSubmittedCreateMobBlueprintHandler, userXChangingRoomsHandler, userXLeavingGameHandler, userSubmittedCreateZoneHandler, userSubmittedEditUserHandler, userSubmittedSuggestHandler, userSubmittedSuggestionsHandler, userSubmittedEraseZoneHandler, safeMessageArrayForUserHandler, safeMessageForUserHandler, userSubmittedBugHandler, userSubmittedEditMapHandler, mapTileStateForUserHandler, hudUpdateForUserHandler, } from "./socketHandlers.js";
import stats from "./commands/stats.js";
import exits from "./commands/exits.js";
import { purifyCommandInput } from "./util/purify.js";
import catchErrorHandlerForFunction from "./util/catchErrorHandlerForFunction.js";
import lookExamine from "./commands/lookExamine.js";
const setupSocket = (io) => {
    try {
        io.on(`connection`, async (socket) => {
            authenticateSessionUserOnSocket(socket);
            if (!authenticateSessionUserOnSocket(socket)) {
                return;
            }
            if (await disconnectMultiplayerOnSocket(socket)) {
                return;
            }
            const user = await setupUserOnSocket(socket);
            if (!user) {
                socket.disconnect;
                return;
            }
            // Remove existing event listeners for the user before adding new ones
            function removeAllListenersForUser(user) {
                worldEmitter.removeAllListeners(`characterDataFor${user.username}`);
                worldEmitter.removeAllListeners(`eraseMapTileFor${user.username}`);
                worldEmitter.removeAllListeners(`equipmentArrayFor${user.username}`);
                worldEmitter.removeAllListeners(`formPromptFor${user.username}`);
                worldEmitter.removeAllListeners(`hudUpdateFor${user.username}`);
                worldEmitter.removeAllListeners(`mapRequestFor${user.username}`);
                worldEmitter.removeAllListeners(`mapTileStateFor${user.username}`);
                worldEmitter.removeAllListeners(`messageArrayFor${user.username}`);
                worldEmitter.removeAllListeners(`messageFor${user.username}`);
                worldEmitter.removeAllListeners(`messageFor${user.username}sRoom`);
                worldEmitter.removeAllListeners(`messageFor${user.username}sZone`);
                worldEmitter.removeAllListeners(`preferenceFor${user.username}`);
                worldEmitter.removeAllListeners(`safeMessageArrayFor${user.username}`);
                worldEmitter.removeAllListeners(`safeMessageFor${user.username}`);
                worldEmitter.removeAllListeners(`updatesArrayFor${user.username}`);
                worldEmitter.removeAllListeners(`user${user.username}LeavingGame`);
                worldEmitter.removeAllListeners(`user${user.username}ChangingRooms`);
                worldEmitter.removeAllListeners(`whoArrayFor${user.username}`);
            }
            removeAllListenersForUser(user);
            // Listen for game events
            worldEmitter.on(`characterDataFor${user.username}`, async (characterData) => {
                socket.emit(`characterData`, characterData);
            });
            worldEmitter.on(`eraseMapTileFor${user.username}`, async (zoneFloorName, roomCoords) => {
                socket.emit(`eraseMapTile`, zoneFloorName, roomCoords);
            });
            worldEmitter.on(`equipmentArrayFor${user.username}`, (equipmentArray) => {
                socket.emit(`equipmentArray`, equipmentArray);
            });
            worldEmitter.on(`formPromptFor${user.username}`, async (formData) => {
                formPromptForUserHandler(formData, socket);
            });
            worldEmitter.on(`hudUpdateFor${user.username}`, async (hudUpdatePackage) => {
                hudUpdateForUserHandler(hudUpdatePackage, socket);
            });
            worldEmitter.on(`mapRequestFor${user.username}`, async (zoneFloorName, mapTileState) => {
                mapRequestForUserHandler(zoneFloorName, mapTileState, socket);
            });
            worldEmitter.on(`mapTileStateFor${user.username}`, async (zoneFloorName, mapTileState) => {
                mapTileStateForUserHandler(zoneFloorName, mapTileState, socket);
            });
            worldEmitter.on(`messageArrayFor${user.username}`, async (messageArray) => {
                messageArrayForUserHandler(messageArray, socket);
            });
            worldEmitter.on(`messageFor${user.username}`, async (message) => {
                messageForUserHandler(message, socket);
            });
            worldEmitter.on(`messageFor${user.username}sRoom`, async (message) => {
                messageForUsersRoomHandler(message, socket, user);
            });
            worldEmitter.on(`messageFor${user.username}sZone`, async (message) => {
                messageForUsersZoneHandler(message, socket, user);
            });
            worldEmitter.on(`preferenceFor${user.username}`, async (preference) => {
                socket.emit(`userPreference`, preference);
            });
            worldEmitter.on(`safeMessageArrayFor${user.username}`, async (messageArray) => {
                safeMessageArrayForUserHandler(messageArray, socket);
            });
            worldEmitter.on(`safeMessageFor${user.username}`, async (message) => {
                safeMessageForUserHandler(message, socket);
            });
            worldEmitter.on(`updatesArrayFor${user.username}`, async (updatesArray) => {
                socket.emit(`updatesArray`, updatesArray);
            });
            worldEmitter.on(`user${user.username}LeavingGame`, async (user) => {
                userXLeavingGameHandler(user, socket);
            });
            worldEmitter.on(`user${user.username}ChangingRooms`, async (originRoomId, originZoneId, destinationRoomId, destinationZoneId) => {
                userXChangingRoomsHandler(originRoomId, originZoneId, destinationRoomId, destinationZoneId, socket, user);
            });
            worldEmitter.on(`whoArrayFor${user.username}`, async (whoArray) => {
                socket.emit(`whoArray`, whoArray);
            });
            // Listen for client events
            socket.on(`userSentCommand`, async (userInput) => {
                userInput = purifyCommandInput(userInput);
                userSentCommandHandler(socket, userInput, user);
            });
            socket.on(`userSubmittedBug`, async (description) => {
                await userSubmittedBugHandler(description, user);
            });
            socket.on(`userSubmittedCreateZone`, async (zoneData) => {
                await userSubmittedCreateZoneHandler(zoneData, user);
            });
            socket.on(`userSubmittedEditItemBlueprint`, async (itemBlueprintData) => {
                await userSubmittedEditItemBlueprintHandler(itemBlueprintData, user);
            });
            socket.on(`userSubmittedEditMap`, async (editMapData) => {
                await userSubmittedEditMapHandler(editMapData, user);
            });
            socket.on(`userSubmittedEditMobBlueprint`, async (mobBlueprintData) => {
                await userSubmittedEditMobBlueprintHandler(mobBlueprintData, user);
            });
            socket.on(`userSubmittedEditRoom`, async (roomData) => {
                await userSubmittedEditRoomHandler(roomData, user);
            });
            socket.on(`userSubmittedEditUser`, async (userDescription) => {
                await userSubmittedEditUserHandler(userDescription, user);
            });
            socket.on(`userSubmittedEditZone`, async (zoneData) => {
                await userSubmittedEditZoneHandler(zoneData, user);
            });
            socket.on(`userSubmittedEraseItemBlueprint`, async (formData) => {
                await userSubmittedEraseItemBlueprintHandler(formData, user);
            });
            socket.on(`userSubmittedEraseMobBlueprint`, async (formData) => {
                await userSubmittedEraseMobBlueprintHandler(formData, user);
            });
            socket.on(`userSubmittedEraseRoom`, async (formData) => await userSubmittedEraseRoomHandler(formData, user));
            socket.on(`userSubmittedEraseZone`, async (zoneId) => await userSubmittedEraseZoneHandler(zoneId, user));
            socket.on(`userSubmittedGoto`, async (gotoFormData) => {
                await userSubmittedGotoHandler(gotoFormData, user);
            });
            socket.on(`userSubmittedCreateItemBlueprint`, async (itemBlueprintData) => {
                await userSubmittedCreateItemBlueprintHandler(itemBlueprintData, user);
            });
            socket.on(`userSubmittedCreateMobBlueprint`, async (mobBlueprintData) => {
                await userSubmittedCreateMobBlueprintHandler(mobBlueprintData, user);
            });
            socket.on(`userSubmittedSuggest`, async (suggestFormData) => {
                await userSubmittedSuggestHandler(suggestFormData, user, socket);
            });
            socket.on(`userSubmittedSuggestions`, async (suggestions) => {
                userSubmittedSuggestionsHandler(suggestions, user, socket);
            });
            // On connection, alert room and lookExamine
            let userArrivedMessage = makeMessage(`userArrived`, `${user.name} enters Restoria.`);
            worldEmitter.emit(`messageFor${user.username}sRoom`, userArrivedMessage);
            await lookExamine({ commandWord: `look` }, user);
            await exits(user);
            stats(user);
            // send a lean copy of user.preferences to client socket for cache
            const userPreferencesCopy = JSON.parse(JSON.stringify(user.preferences)); //deep copy
            delete userPreferencesCopy._id;
            socket.emit(`userPreferences`, userPreferencesCopy);
            socket.on(`disconnect`, async () => {
                try {
                    let message = makeMessage("quit", `${user.name} left Restoria.`);
                    worldEmitter.emit(`messageFor${user.username}sRoom`, message);
                    logger.info(`User socket disconnected: ${user.name}`);
                    // Alert zoneManager, which will remove user from their location's room.users array
                    // Then, zonemanager will alert userManager to remove user from users map
                    worldEmitter.emit(`socketDisconnectedUser`, user);
                    // Remove existing event listeners for user
                    removeAllListenersForUser(user);
                }
                catch (error) {
                    catchErrorHandlerForFunction(`socket.on('disconnect')`, error, user?.name);
                }
            });
        });
    }
    catch (err) {
        throw err;
    }
};
export default setupSocket;
