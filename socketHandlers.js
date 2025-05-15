// socketHandlers
import mongoose from "mongoose";
import logger from "./logger.js";
import User from "./model/classes/User.js";
import getZoneOfUser from "./util/getZoneofUser.js";
import purifyDescriptionOfObject, { purifyAllStringPropsOfObject, } from "./util/purify.js";
import { historyStartingNow } from "./model/classes/History.js";
import stats from "./commands/stats.js";
import bug from "./commands/bug.js";
import worldEmitter from "./model/classes/WorldEmitter.js";
import makeMessage from "./util/makeMessage.js";
import catchErrorHandlerForFunction from "./util/catchErrorHandlerForFunction.js";
import editItemBlueprint from "./commands/editItemBlueprint.js";
import editMobBlueprint from "./commands/editMobBlueprint.js";
import editRoom from "./commands/editRoom.js";
import getRoomOfUser from "./util/getRoomOfUser.js";
import createZone from "./commands/createZone.js";
import editZone from "./commands/editZone.js";
import relocateUser from "./util/relocateUser.js";
import createItemBlueprint from "./commands/createItemBlueprint.js";
import createMobBlueprint from "./commands/createMobBlueprint.js";
import editUser from "./commands/editUser.js";
import saveSuggestions from "./commands/saveSuggestions.js";
import eraseZone from "./commands/eraseZone.js";
import eraseRoom from "./commands/eraseRoom.js";
import editMap from "./commands/editMap.js";
export const eraseMapTileForUserHandler = async (zoneFloorName, mapCoords, socket) => {
    try {
        socket.emit(`eraseMapTile`, zoneFloorName, mapCoords);
    }
    catch (error) {
        catchErrorHandlerForFunction(`eraseMapTileForUserHandler`, error);
    }
};
export const formPromptForUserHandler = async (formData, socket) => {
    const formEventMap = {
        bugForm: "openBugForm",
        createItemBlueprintForm: "openCreateItemBlueprintForm",
        createMobBlueprintForm: "opencreateMobBlueprintForm",
        createRoomForm: "openCreateRoomForm",
        createZoneForm: "openCreateZoneForm",
        editItemBlueprintForm: "openEditItemBlueprintForm",
        editMapForm: "openEditMapForm",
        editMobBlueprintForm: "openEditMobBlueprintForm",
        editRoomForm: "openEditRoomForm",
        editUserForm: "openEditUserForm",
        editZoneForm: "openEditZoneForm",
        eraseItemBlueprintForm: "openEraseItemBlueprintForm",
        eraseMobBlueprintForm: "openEraseMobBlueprintForm",
        eraseRoomForm: "openEraseRoomForm",
        eraseZoneForm: "openEraseZoneForm",
        gotoForm: "openGotoForm",
        suggestForm: "openSuggestForm",
        suggestionsForm: "openSuggestionsForm",
    };
    const eventName = formEventMap[formData.form];
    if (eventName) {
        if (["openCreateZoneForm"].includes(eventName)) {
            socket.emit(eventName);
        }
        else {
            socket.emit(eventName, formData);
        }
    }
};
export const hudUpdateForUserHandler = async (hudUpdatePackage, socket) => {
    try {
        console.log("emitting hudUpdatePackage on socket:");
        console.log(hudUpdatePackage);
        socket.emit(`hudUpdate`, hudUpdatePackage);
    }
    catch (error) {
        catchErrorHandlerForFunction(`hudUpdateForUserHandler`, error);
    }
};
export const mapRequestForUserHandler = async (zoneFloorName, mapTileState, socket) => {
    try {
        socket.emit(`mapRequest`, zoneFloorName, mapTileState);
    }
    catch (error) {
        catchErrorHandlerForFunction(`mapRequestForUserHandler`, error);
    }
};
export const mapTileStateForUserHandler = async (zoneFloorName, mapTileState, socket) => {
    try {
        socket.emit(`mapTileState`, zoneFloorName, mapTileState);
    }
    catch (error) {
        catchErrorHandlerForFunction(`mapTileStateForUserHandler`, error);
    }
};
export const messageArrayForUserHandler = async (messageArray, socket) => {
    try {
        for (let message of messageArray) {
            socket.emit(`message`, message);
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`messageArrayForUserHandler`, error);
    }
};
// a safeMessage should never contain user-generated text
export const safeMessageArrayForUserHandler = async (messageArray, socket) => {
    try {
        for (let message of messageArray) {
            socket.emit(`safeMessage`, message);
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`safeMessageArrayForUserHandler`, error);
    }
};
export const messageForUserHandler = async (message, socket) => {
    try {
        socket.emit(`message`, message);
    }
    catch (error) {
        catchErrorHandlerForFunction(`messageForUserHandler`, error);
    }
};
// a safeMessage should never contain user-generated text
export const safeMessageForUserHandler = async (message, socket) => {
    try {
        socket.emit(`safeMessage`, message);
    }
    catch (error) {
        catchErrorHandlerForFunction(`safeMessageForUserHandler`, error);
    }
};
export const messageForUsersRoomHandler = async (message, socket, user) => {
    try {
        socket.to(user.location.inRoom.toString()).emit(`message`, message);
    }
    catch (error) {
        catchErrorHandlerForFunction(`messageForUsersRoomHandler`, error, user?.name);
    }
};
export const messageForUsersZoneHandler = async (message, socket, user) => {
    try {
        socket.to(user.location.inZone.toString()).emit(`message`, message);
    }
    catch (error) {
        catchErrorHandlerForFunction(`messageForUsersZoneHandler`, error, user?.name);
    }
};
export const userSubmittedBugHandler = async (description, user) => {
    await bug(description, user);
};
export const userSubmittedEditItemBlueprintHandler = async (itemBlueprintData, user) => {
    try {
        purifyDescriptionOfObject(itemBlueprintData);
        await editItemBlueprint(itemBlueprintData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEditItemBlueprintHandler`, error);
    }
};
export const userSubmittedEditMapHandler = async (editMapData, user) => {
    try {
        await editMap(editMapData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEditMapHandler`, error, user?.name);
    }
};
export const userSubmittedEditMobBlueprintHandler = async (mobBlueprintData, user) => {
    try {
        purifyDescriptionOfObject(mobBlueprintData);
        await editMobBlueprint(mobBlueprintData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEditMobBlueprintHandler`, error, user?.name);
    }
};
export const userSubmittedEditRoomHandler = async (roomData, user) => {
    try {
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Room not found for user ${user.name}`);
        }
        purifyDescriptionOfObject(roomData);
        await editRoom(room, roomData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEditRoomHandler`, error, user?.name);
    }
};
export const userSubmittedEditZoneHandler = async (zoneData, user) => {
    try {
        purifyDescriptionOfObject(zoneData);
        await editZone(zoneData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEditZoneHandler`, error, user?.name);
    }
};
export const userSubmittedEraseItemBlueprintHandler = async (formData, user) => {
    try {
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        await zone.eraseItemBlueprintById(formData._id);
        logger.info(`User ${user.name} erased itemBlueprint ${formData.name}, id: ${formData._id}`);
        let message = makeMessage("success", `You permanently erased the itemBlueprint for ${formData.name}.`);
        worldEmitter.emit(`messageFor${user.username}`, message);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEraseItemBlueprintHandler`, error, user?.name);
    }
};
export const userSubmittedEraseMobBlueprintHandler = async (formData, user) => {
    try {
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        await zone.eraseMobBlueprintById(formData._id);
        logger.info(`User ${user.name} erased mobBlueprint ${formData.name}, id: ${formData._id}`);
        let message = makeMessage("success", `You permanently erased the mobBlueprint for ${formData.name}.`);
        worldEmitter.emit(`messageFor${user.username}`, message);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEraseMobBlueprintHandler`, error, user?.name);
    }
};
export const userSubmittedEraseRoomHandler = async (formData, user) => {
    eraseRoom(formData, user);
};
export const userSubmittedEraseZoneHandler = async (zoneId, user) => {
    try {
        await eraseZone(zoneId, user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEraseZoneHandler`, error, user?.name);
    }
};
export const userSubmittedGotoHandler = async (gotoFormData, user) => {
    try {
        worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`success`, `${user.name} disappears.`));
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `You close your eyes for a moment, imagine the location, and appear there.`));
        await relocateUser(user, gotoFormData);
        worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`success`, `${user.name} appears.`));
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedGotoHandler`, error, user?.name);
    }
};
export const userSubmittedCreateItemBlueprintHandler = async (itemBlueprintData, user) => {
    try {
        purifyDescriptionOfObject(itemBlueprintData);
        await createItemBlueprint(itemBlueprintData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedCreateItemBlueprintHandler`, error, user?.name);
    }
};
export const userSubmittedCreateMobBlueprintHandler = async (mobBlueprintData, user) => {
    try {
        purifyDescriptionOfObject(mobBlueprintData);
        await createMobBlueprint(mobBlueprintData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedCreateMobBlueprintHandler`, error, user?.name);
    }
};
export const userSubmittedCreateZoneHandler = async (zoneData, user) => {
    try {
        purifyDescriptionOfObject(zoneData);
        await createZone(zoneData, user);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedCreateZoneHandler`, error, user?.name);
    }
};
export const userSubmittedEditUserHandler = async (userDescription, user) => {
    try {
        purifyDescriptionOfObject(userDescription);
        await editUser(user, userDescription);
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedEditUserHandler`, error, user?.name);
    }
};
export const userSubmittedSuggestHandler = async (suggestFormData, user, socket) => {
    try {
        suggestFormData = purifyAllStringPropsOfObject(suggestFormData);
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        const author = await User.findById(zone.author);
        let authorName = author?.name || "the author";
        if (zone.history.completionStatus === "published") {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `This zone is already published! Contact ${authorName} with your suggestion.`));
            return;
        }
        const suggestion = {
            authorId: user._id,
            authorName: user.name,
            refersToId: new mongoose.Types.ObjectId(suggestFormData._id),
            refersToObjectType: suggestFormData.refersToObjectType,
            body: suggestFormData.body,
            status: "pending",
            history: historyStartingNow(),
        };
        switch (suggestFormData.refersToObjectType) {
            case "room":
                suggestion.refersToId = user.location.inRoom;
                break;
            case "zone":
                suggestion.refersToId = user.location.inZone;
                break;
            default:
                break;
        }
        zone.suggestions.push(suggestion);
        await zone.save();
        await zone.initRooms();
        socket.emit("message", makeMessage("success", `We saved your suggestion for this ${suggestFormData.refersToObjectType}.`));
        stats(user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedSuggestHandler`, error, user?.name);
    }
};
export const userSubmittedSuggestionsHandler = async (suggestions, user, socket) => {
    try {
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't get ${user.username}'s zone.`);
        }
        await saveSuggestions(suggestions, zone);
        stats(user);
        socket.emit("message", makeMessage("success", `We saved the suggestions for ${zone.name}.`));
    }
    catch (error) {
        catchErrorHandlerForFunction(`userSubmittedSuggestionsHandler`, error, user?.name);
    }
};
export const userXLeavingGameHandler = async (user, socket) => {
    try {
        socket.emit(`redirectToLogin`, `User ${user.name} left the game.`);
        socket.disconnect;
    }
    catch (error) {
        catchErrorHandlerForFunction(`userXLeavingGameHandler`, error, user?.name);
    }
};
export const userXChangingRoomsHandler = (originRoomId, originZoneId, destinationRoomId, destinationZoneId, socket, user) => {
    try {
        // update room chat
        socket.leave(originRoomId);
        socket.join(destinationRoomId);
        // update zone chat
        if (originZoneId !== destinationZoneId) {
            socket.leave(originZoneId);
            socket.join(destinationZoneId);
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`userXChangingRoomsHandler`, error, user?.name);
    }
};
