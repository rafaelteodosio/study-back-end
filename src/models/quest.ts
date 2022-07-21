import client from "../db.ts";
import { type IQuestion } from "./question.ts";

export interface IQuest {
  id: number;
  questNumber: number;
  name: string;
  summary: string;
}

class Quest implements IQuest {
  id: number;
  questNumber: number;
  name: string;
  summary: string;
  questions?: IQuestion[];

  constructor(quest: IQuest) {
    this.id = quest.id;
    this.questNumber = quest.questNumber;
    this.name = quest.name;
    this.summary = quest.summary;
  }

  async getQuestions(): Promise<Error | null> {
    try {
      const { rows } = await client.queryObject<IQuestion>(
        "SELECT id, question_text, alternatives, answer FROM question WHERE quest_id = $ID",
        { id: this.id },
      );

      this.questions = rows;
      return null;
    } catch (error) {
      return error;
    }
  }

  static async getQuestById(
    id: number,
  ): Promise<[Quest | null, Error | null]> {
    try {
      const { rows } = await client.queryObject<IQuest>(
        "SELECT id, quest_number, name, summary FROM quest WHERE id = $ID",
        { id },
      );

      if (rows.length == 0) {
        return [null, new Error("Quest not found")];
      }

      const quest = new Quest(rows[0]);

      return [quest, null];
    } catch (error) {
      return [null, error];
    }
  }

  static async listQuests(): Promise<[IQuest[] | null, Error | null]> {
    try {
      const { rows } = await client.queryObject<IQuest>(
        "SELECT id, quest_number, name, summary FROM quest",
      );

      return [rows, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export default Quest;
