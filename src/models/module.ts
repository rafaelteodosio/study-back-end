import client from "../db.ts";
import { IQuest } from "./quest.ts";

interface IModule {
  id: number;
  name: string;
  description: string;
  reward: number;
}

class Module implements IModule {
  id: number;
  name: string;
  description: string;
  reward: number;
  quests?: IQuest[];

  constructor(module: IModule) {
    this.id = module.id;
    this.name = module.name;
    this.description = module.description;
    this.reward = module.reward;
  }

  async getQuests() {
    try {
      const { rows } = await client.queryObject<IQuest>(
        "SELECT id, quest_number, name, summary FROM quest WHERE module_id = $ID",
        { id: this.id },
      );

      this.quests = rows;
      return null;
    } catch (error) {
      return error;
    }
  }

  static async getModuleById(
    id: number,
  ): Promise<[Module | null, Error | null]> {
    try {
      const { rows } = await client.queryObject<IModule>(
        "SELECT id, name, description, reward FROM module WHERE id = $ID",
        { id },
      );

      if (rows.length == 0) {
        return [null, new Error("Module not found")];
      }

      const module = new Module(rows[0]);

      return [module, null];
    } catch (error) {
      return [null, error];
    }
  }

  static async listModules(): Promise<[IModule[] | null, Error | null]> {
    try {
      const { rows } = await client.queryObject<IModule>(
        "SELECT id, name, description, reward FROM module",
      );

      return [rows, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export default Module;
