// processCommand
import logger from "../logger.js";
import exits from "../commands/exits.js";
import quit from "../commands/quit.js";
import say from "../commands/say.js";
import shout from "../commands/shout.js";
import telepath from "../commands/telepath.js";
import who from "../commands/who.js";
import { IParsedCommand } from "./parseCommand.js";
import { IUser } from "../model/classes/User.js";
import stats from "../commands/stats.js";
import move from "../commands/move.js";
import edit from "../commands/edit.js";
import create from "../commands/create.js";
import erase from "../commands/erase.js";
import recall from "../commands/recall.js";
import goto from "../commands/goto.js";
import suggest from "../commands/suggest.js";
import suggestions from "../commands/suggestions.js";
import editor from "../commands/editor.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import help from "../commands/help.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import bugs from "../commands/bugs.js";
import updates from "../commands/updates.js";
import studyresearch from "../commands/studyresearch.js";
import map from "../commands/map.js";
import password from "../commands/password.js";
import sudobugs from "../commands/sudobugs.js";
import sudobug from "../commands/sudobug.js";
import autoExamine from "../commands/autoExamine.js";
import lookExamine from "../commands/lookExamine.js";
import get from "../commands/get.js";
import save from "../commands/save.js";
import roomSummary from "../commands/roomSummary.js";
import inventory from "../commands/inventory.js";
import drop from "../commands/drop.js";
import give from "../commands/give.js";
import put from "../commands/put.js";
import equip from "../commands/equip.js";
import unequip from "../commands/unequip.js";
import equipped from "../commands/equipment.js";
import character from "../commands/character.js";
import attack from "../commands/attack.js";

async function processCommand(parsedCommand: IParsedCommand, user: IUser) {
  try {
    switch (parsedCommand.commandWord) {
      // A commands ******************** (and aliases for them)
      case `attack`: {
        await attack(parsedCommand, user);
        break;
      }
      case `autoexamine`: {
        await autoExamine(parsedCommand, user);
        break;
      }
      // B commands ******************** (and aliases for them)
      case `bug`: {
        help(
          {
            commandWord: "help",
            directObject: "bug",
          },
          user
        );
        worldEmitter.emit(`formPromptFor${user.username}`, {
          form: `bugForm`,
        });
        break;
      }
      case `plans`:
      case `bugs`: {
        await bugs(user);
        break;
      }
      // C commands ******************** (and aliases for them)
      case `character`: {
        await character(parsedCommand, user);
        break;
      }
      case `create`: {
        await create(parsedCommand, user);
        break;
      }
      // D commands ******************** (and aliases for them)
      case `drop`: {
        await drop(parsedCommand, user);
        break;
      }
      // E commands ******************** (and aliases for them)
      case `edit`: {
        await edit(parsedCommand, user);
        break;
      }
      case `editor`: {
        await editor(parsedCommand, user);
        break;
      }
      case `equip`:
      case `wear`:
      case `wield`: {
        await equip(parsedCommand, user);
        break;
      }
      case `equipment`:
      case `equipped`:
      case `eq`: {
        await equipped(parsedCommand, user);
        break;
      }
      case `erase`:
      case `delete`: {
        // we can't make a delete() function, so it calls erase()
        await erase(parsedCommand, user);
        break;
      }
      case `exits`: {
        await exits(user);
        break;
      }
      // G commands ******************** (and aliases for them)
      case `get`: {
        await get(parsedCommand, user);
        break;
      }
      case `give`: {
        await give(parsedCommand, user);
        break;
      }
      case `goto`: {
        await goto(user);
        break;
      }
      // H commands ******************** (and aliases for them)
      case `help`: {
        help(parsedCommand, user);
        break;
      }
      // I commands ******************** (and aliases for them)
      case `inventory`: {
        await inventory(user);
        break;
      }
      // L commands ******************** (and aliases for them)
      case `look`:
      case `examine`: {
        await lookExamine(parsedCommand, user);
        break;
      }
      // M commands ******************** (and aliases for them)
      case `map`: {
        await map(parsedCommand, user);
        break;
      }
      case `north`:
      case `east`:
      case `south`:
      case `west`:
      case `up`:
      case `down`: {
        await move(parsedCommand, user);
        break;
      }
      // P commands ******************** (and aliases for them)
      case `password`: {
        await password(parsedCommand, user);
        break;
      }
      case `put`: {
        await put(parsedCommand, user);
        break;
      }
      // Q commands ******************** (and aliases for them)
      case `quit`: {
        await quit(user);
        break;
      }
      // R commands ******************** (and aliases for them)
      case `recall`: {
        await recall(user);
        break;
      }
      case `roomsummary`: {
        await roomSummary(user);
        break;
      }
      // S commands ******************** (and aliases for them)
      case `save`: {
        await save(user);
        break;
      }
      case `say`: {
        say(parsedCommand, user);
        break;
      }
      case `shout`: {
        shout(parsedCommand, user);
        break;
      }
      case `stats`:
      case `hud`: {
        stats(user);
        break;
      }
      case `study`:
      case `research`: {
        studyresearch(parsedCommand, user);
        break;
      }
      case `sudobug`: {
        sudobug(parsedCommand, user);
        break;
      }
      case `sudobugs`: {
        await sudobugs(parsedCommand, user);
        break;
      }
      case `suggest`: {
        await suggest(parsedCommand, user);
        break;
      }
      case `suggestions`: {
        await suggestions(user);
        break;
      }
      // T commands ******************** (and aliases for them)
      case `telepath`: {
        await telepath(parsedCommand, user);
        break;
      }
      // U commands ******************** (and aliases for them)
      case `unequip`:
      case `remove`: {
        await unequip(parsedCommand, user);
        break;
      }
      case `updates`: {
        await updates(parsedCommand, user);
        break;
      }
      // W commands ******************** (and aliases for them)
      case `who`: {
        await who(user);
        break;
      }
      default: {
        logger.error(
          `processCommand couldn't process a valid command: ${parsedCommand.commandWord}`
        );
      }
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`processCommand`, error, user?.name);
  }
}

export default processCommand;
