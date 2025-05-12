// createUser
// allows user to create new users from the /register page
import makeMessage from "../util/makeMessage.js";
import logger from "../logger.js";
import User, { IUser } from "../model/classes/User.js";
import isValidName from "../util/isValidName.js";
import IMessage from "../types/Message.js";
import Name from "../model/classes/Name.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { historyStartingNow } from "../model/classes/History.js";
import purifyDescriptionOfObject from "../util/purify.js";
import WORLD_RECALL from "../constants/WORLD_RECALL.js";

export interface IUserData {
  username: string;
  name: string;
  password: string;
  pronouns: number;
  job: string;
}

// Return user, or a message explaining failure (if by author, emit message to their socket)
async function createUser(userFormData: IUserData): Promise<IUser | IMessage> {
  try {
    let message = makeMessage("rejection", ``);
    // Validate new name
    if (!isValidName(userFormData.username)) {
      message.content = `Name must be letters only (max. 18), no unique irl names (e.g. no "Obama")`;
      return message;
    }
    // Check for duplicate name
    let nameIsTaken = await Name.findOne({
      name: userFormData.username,
    });
    if (nameIsTaken) {
      message.content = `That name is taken.`;
      return message;
    }
    // Validate password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!passwordRegex.test(userFormData.password)) {
      message.content =
        "Password must be at least 8 characters long and include lowercase, uppercase, and a number.";
      return message;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userFormData.password, salt);

    let newUserData: any = {
      _id: new mongoose.Types.ObjectId(),
      username: userFormData.username.toLowerCase(),
      name: userFormData.name,
      password: hashedPassword,
      salt: salt,
      isAdmin: false,
      location: WORLD_RECALL,
      pronouns: userFormData.pronouns,
      history: historyStartingNow(),
      hoursPlayed: 0,
      job: userFormData.job,
      level: 1,
      statBlock: {
        strength: 12,
        dexterity: 12,
        constitution: 12,
        intelligence: 12,
        wisdom: 12,
        charisma: 12,
        spirit: 0,
      },
      goldHeld: 0,
      goldBanked: 0,
      trainingPoints: 30,
      jobLevels: {
        cleric: 0,
        mage: 0,
        rogue: 0,
        warrior: 0,
      },
      description: {
        examine: ``,
        study: ``,
        research: ``,
      },
      //may change when training is implemented
      trained: [],
      inventory: [],
      storage: [],
      equipped: {
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
      },
      affixes: [],
      _currentHp: 8,
      _currentMp: 8,
      _currentMv: 8,
      readyForAttack: true,
      readyForAction: true,
      readyForBonusAction: true,
    };

    switch (newUserData.job) {
      case "cleric": {
        newUserData.statBlock.wisdom = 14;
        newUserData.jobLevels.cleric = 1;
        break;
      }
      case "mage": {
        newUserData.statBlock.intelligence = 14;
        newUserData.jobLevels.mage = 1;
        break;
      }
      case "rogue": {
        newUserData.statBlock.dexterity = 14;
        newUserData.jobLevels.rogue = 1;
        break;
      }
      case "warrior": {
        newUserData.statBlock.strength = 14;
        newUserData.jobLevels.warrior = 1;
        break;
      }
      default:
        break;
    }
    purifyDescriptionOfObject(newUserData);

    // create the user in mongoose (objectId will be assigned when user.save())
    const newUser = new User(newUserData);
    if (!newUser) {
      logger.error(`createUser couldn't save new user ${newUserData.name}!`);
      message.content = `Sorry, we ran into a problem saving your user!`;
      return message;
    }
    await newUser.save();

    const nameToRegister = new Name({ name: newUser.username });
    const nameSaved = await nameToRegister.save();
    if (!nameSaved) {
      logger.error(
        `createZone couldn't save the name ${newUser.name} to Names!`
      );
      message.content = `Sorry, we ran into a problem saving your user!`;
      return message;
    }

    logger.info(`New user registered: "${newUser.name}".`);

    return newUser;
  } catch (error: unknown) {
    throw error;
  }
}

export default createUser;
