import client from "../db.ts";
import { type IQuestion } from "./question.ts";
import type User from "./user.ts";

export interface IQuest {
  id: number;
  questNumber: number;
  name: string;
  summary: string;
  reward: number;
}

class Quest implements IQuest {
  id: number;
  questNumber: number;
  name: string;
  summary: string;
  questions?: IQuestion[];
  reward: number;

  constructor(quest: IQuest) {
    this.id = quest.id;
    this.questNumber = quest.questNumber;
    this.name = quest.name;
    this.summary = quest.summary;
    this.reward = quest.reward;
  }

  async completeQuest(user: User, answers: number): Promise<Error | null> {
    try {
      if (!this.questions) {
        return new Error("Quest must have questions");
      }
      const ratio = (answers / this.questions.length).toFixed(3);
      const user_id = user.id;
      const value = Math.floor(this.reward * Number(ratio));
      const quest_id = this.id;

      await client.queryArray(
        `UPDATE users SET balance = balance + $VALUE WHERE id = $USER_ID`,
        { user_id, value },
      );

      await client.queryArray(
        `INSERT INTO user_quest (user_id, quest_id, ratio) 
          VALUES ($USER_ID, $QUEST_ID, $RATIO)`,
        { user_id, quest_id, ratio },
      );

      return null;
    } catch (error) {
      return error;
    }
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
        "SELECT id, quest_number, name, summary, reward FROM quest WHERE id = $ID",
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
        "SELECT id, quest_number, name, summary, reward FROM quest",
      );

      return [rows, null];
    } catch (error) {
      return [null, error];
    }
  }
  static async listCompleteQuests(
    user: User,
  ): Promise<[IQuest[] | null, Error | null]> {
    try {
      const user_id = user.id;

      const { rows } = await client.queryObject<IQuest>(
        `SELECT id, quest_number, name, summary, reward FROM quest
          WHERE id IN (SELECT quest_id FROM user_quest WHERE user_id = $USER_ID)`,
        { user_id },
      );

      return [rows, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export default Quest;
