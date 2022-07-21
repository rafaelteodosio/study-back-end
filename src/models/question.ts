import client from "../db.ts";

export interface IQuestion {
  id: number;
  questionText: string;
  alternatives: Record<string, string>;
  answer: string;
}

class Question implements IQuestion {
  id: number;
  questionText: string;
  alternatives: Record<string, string>;
  answer: string;

  constructor(question: IQuestion) {
    this.id = question.id;
    this.questionText = question.questionText;
    this.alternatives = question.alternatives;
    this.answer = question.answer;
  }

  static async getQuestionById(
    id: number,
  ): Promise<[Question | null, Error | null]> {
    try {
      const { rows } = await client.queryObject<IQuestion>(
        "SELECT id, question_text, alternatives, answer FROM question WHERE id = $ID",
        { id },
      );

      if (rows.length == 0) {
        return [null, new Error("Question not found")];
      }

      const question = new Question(rows[0]);

      return [question, null];
    } catch (error) {
      return [null, error];
    }
  }

  static async listQuestions(): Promise<[IQuestion[] | null, Error | null]> {
    try {
      const { rows } = await client.queryObject<IQuestion>(
        "SELECT id, question_text, alternatives, answer FROM question",
      );

      return [rows, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export default Question;
