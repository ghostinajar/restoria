// Zone
import mongoose from "mongoose";
import historySchema from "./History.js";
import descriptionSchema from "./Description.js";
import roomSchema from "./Room.js";
import mobBlueprintSchema from "./MobBlueprint.js";
import itemBlueprintSchema from "./ItemBlueprint.js";
import suggestionSchema from "./Suggestion.js";
import catchErrorHandlerForFunction from "../../util/catchErrorHandlerForFunction.js";
import recall from "../../commands/recall.js";
const { Schema } = mongoose;
const zoneSchema = new Schema({
    _id: Schema.Types.ObjectId,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    name: String,
    history: {
        type: historySchema,
        default: () => ({}),
    },
    description: {
        type: descriptionSchema,
        default: () => ({}),
    },
    rooms: [
        {
            type: roomSchema,
            default: () => [],
        },
    ],
    // might not need if stored in room.mapTile and map constructed in browser...
    // map: {
    //   type: Map,
    //   of: {
    //     character: String,
    //     color: String,
    //     wallColor: String,
    //   },
    //   default: () => new Map(),
    // },
    mobBlueprints: [
        {
            type: mobBlueprintSchema,
            default: () => [],
        },
    ],
    itemBlueprints: [
        {
            type: itemBlueprintSchema,
            default: () => [],
        },
    ],
    suggestions: [
        {
            type: suggestionSchema,
            default: () => ({}),
        },
    ],
    minutesToReconstruct: {
        type: Number,
        default: 15,
    },
});
zoneSchema.methods.initRooms = async function () {
    try {
        //instantiate room instances
        for (const room of this.rooms) {
            await room.initiate(); //setup room's contents arrays (inventory, mobs, users)
        }
        return;
    }
    catch (error) {
        catchErrorHandlerForFunction(`Zone.initRooms`, error);
    }
};
zoneSchema.methods.clearRooms = async function () {
    try {
        // Clear each room's contents
        for (const room of this.rooms.values()) {
            // Assuming each room has a method to clear its contents
            // logger.debug(`Clearing contents of room "${room.name}"`);
            await room.clearContents();
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`Zone.clearRooms`, error);
    }
};
zoneSchema.methods.eraseItemBlueprintById = async function (id) {
    try {
        // Remove the item blueprint from the zone
        this.itemBlueprints = this.itemBlueprints.filter((blueprint) => blueprint._id.toString() !== id.toString());
        // Remove its itemNodes from all rooms
        this.rooms.forEach((room) => {
            room.itemNodes = removeNodesWithBlueprintId(id, room.itemNodes);
        });
        // Remove its itemNodes from other itemBlueprints
        this.itemBlueprints.forEach((itemBlueprint) => {
            if (itemBlueprint.itemNodes) {
                itemBlueprint.itemNodes = removeNodesWithBlueprintId(id, itemBlueprint.itemNodes);
            }
        });
        // Remove its itemNodes from mobBlueprints
        this.mobBlueprints.forEach((mobBlueprint) => {
            mobBlueprint.itemNodes = removeNodesWithBlueprintId(id, mobBlueprint.itemNodes);
        });
        await this.save();
        await this.initRooms();
    }
    catch (error) {
        catchErrorHandlerForFunction(`Zone.eraseItemBlueprintById`, error);
    }
};
zoneSchema.methods.eraseMobBlueprintById = async function (id) {
    try {
        // Remove the mob blueprint from the zone
        this.mobBlueprints = this.mobBlueprints.filter((blueprint) => blueprint._id.toString() !== id.toString());
        // Remove its mobNodes from all rooms
        this.rooms.forEach((room) => {
            room.mobNodes = removeNodesWithBlueprintId(id, room.mobNodes);
        });
        await this.save();
        await this.initRooms();
    }
    catch (error) {
        catchErrorHandlerForFunction(`Zone.eraseMobBlueprintById`, error);
    }
};
zoneSchema.methods.eraseRoomById = async function (id) {
    try {
        // sends any users currently in the room to recall
        const room = this.rooms.find((room) => room._id.toString() === id);
        if (room) {
            room.users.forEach(async (user) => {
                await recall(user);
            });
        }
        // Remove the room from the zone
        this.rooms = this.rooms.filter((room) => room._id.toString() !== id.toString());
        // Loop through each room and remove exits that lead to the deleted room
        this.rooms.forEach((room) => {
            const directions = [
                "north",
                "east",
                "south",
                "west",
                "up",
                "down",
            ];
            directions.forEach((direction) => {
                const exit = room.exits[direction];
                if (exit &&
                    exit.destinationLocation &&
                    exit.destinationLocation.inRoom.toString() === id.toString()) {
                    room.exits[direction] = null; // Remove the exit if it leads to the deleted room
                }
            });
        });
        await this.save();
        await this.initRooms();
    }
    catch (error) {
        catchErrorHandlerForFunction(`Zone.eraseRoomById`, error);
    }
};
// Helper function to remove nodes by blueprint id
const removeNodesWithBlueprintId = (id, nodes) => {
    return nodes.filter((node) => node.loadsBlueprintId.toString() !== id.toString());
};
const Zone = mongoose.model("Zone", zoneSchema);
export default Zone;
