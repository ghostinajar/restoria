// LootBag
import { IItem } from "../model/classes/Item.js";

interface ILootBag {
  fromName: string;
  items: Array<IItem>;
  gold: number;
}

export default ILootBag;
