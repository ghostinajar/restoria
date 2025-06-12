// createRoom
// saves incoming data from create_room_form user submission
import logger from "../logger.js";
import roomSchema from "../model/classes/Room.js";
import mongoose from "mongoose";
import ROOM_TYPE from "../constants/ROOM_TYPE.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import exits from "./exits.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import { historyStartingNow } from "../model/classes/History.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getAvailableExitsForCreateRoom from "../util/getAvailableExitsForCreateRoom.js";
import makeExitToRoomId from "../util/makeExitToRoomId.js";
import lookExamine from "./lookExamine.js";
import packAndSendMapTileStateToUser from "../util/packAndSendMapTileStateToUser.js";
import messageToUsername from "../util/messageToUsername.js";
async function createRoom(direction, user, roomName) {
    try {
        let originRoom = await getRoomOfUser(user);
        if (!originRoom) {
            throw new Error(`Couldn't find origin room to create room.`);
        }
        let originZone = await getZoneOfUser(user);
        if (!originZone) {
            throw new Error(`Couldn't find origin zone to create room.`);
        }
        const availableDirections = await getAvailableExitsForCreateRoom(user);
        if (!availableDirections.includes(direction)) {
            messageToUsername(user.username, `There's already a room ${direction} from here.`, `rejection`, true);
            return;
        }
        let newRoomData = {
            _id: new mongoose.Types.ObjectId(),
            author: user._id,
            fromZoneId: originZone._id,
            roomType: ROOM_TYPE.NONE,
            name: roomName || `This zone's author needs to name this room.`,
            history: historyStartingNow(),
            playerCap: 18,
            mobCap: 18,
            isDark: false,
            isIndoors: false,
            isOnWater: false,
            isUnderwater: false,
            noMounts: false,
            noMobs: false,
            noMagic: false,
            noCombat: false,
            itemsForSale: [],
            mountIdForSale: [],
            mapCoords: [...originRoom.mapCoords], // spread to avoid mutation of original
            mapTile: { character: "·", color: "white", wallColor: "white" },
            description: {
                look: `This zone's author needs to write a LOOK description here.`,
                examine: `This zone's author needs to write an EXAMINE description here.`,
            },
            exits: {},
            mobNodes: [],
            itemNodes: [],
            inventory: [],
            mobs: [],
            users: [],
            addEntityTo: roomSchema.methods.addEntityTo,
            removeEntityFrom: roomSchema.methods.removeEntityFrom,
            destroyMob: roomSchema.methods.destroyMob
        };
        switch (direction) {
            case "north": {
                newRoomData.mapCoords[1]--;
                newRoomData.exits.south = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.north = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            case "east": {
                newRoomData.mapCoords[0]++;
                newRoomData.exits.west = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.east = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            case "south": {
                newRoomData.mapCoords[1]++;
                newRoomData.exits.north = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.south = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            case "west": {
                newRoomData.mapCoords[0]--;
                newRoomData.exits.east = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.west = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            case "up": {
                newRoomData.mapCoords[2]++;
                newRoomData.exits.down = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.up = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            case "down": {
                newRoomData.mapCoords[2]--;
                newRoomData.exits.up = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.down = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            default:
                break;
        }
        if (newRoomData.mapCoords[0] > 79 ||
            newRoomData.mapCoords[0] < 0 ||
            newRoomData.mapCoords[1] > 79 ||
            newRoomData.mapCoords[1] < 0 ||
            newRoomData.mapCoords[2] > 10 ||
            newRoomData.mapCoords[2] < -10) {
            messageToUsername(user.username, `Sorry, your room couldn't be saved due to a map error. Ralu will look into this ASAP.`, `rejection`, true);
            throw new Error(`createRoom failed due to invalid mapCoords ${JSON.stringify(newRoomData.mapCoords)}`);
        }
        originZone.rooms.push(newRoomData);
        await originZone.save();
        await originZone.initRooms();
        await packAndSendMapTileStateToUser(user, newRoomData, originZone);
        logger.info(`Author "${user.name}" created room "${newRoomData.name}".`);
        messageToUsername(user.username, `You created a new room ${direction} from here!`, `success`, false);
        await lookExamine({ commandWord: "look" }, user);
        await exits(user);
    }
    catch (error) {
        catchErrorHandlerForFunction("createRoom", error, user.name);
    }
}
export default createRoom;
