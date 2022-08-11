import client from "../db.ts";
import { type IInvestment } from "./investment.ts";
import Investment from "./investment.ts";
import { generateFluctuations } from "../mocks/generateFluctuations.ts";

interface IUserInvestment {
  id: number;
  user_id: number;
  investment_id: number;
  start_date: Date;
  value: number;
  investment?: IInvestment;
}

class UserInvestment implements IUserInvestment {
  id: number;
  user_id: number;
  investment_id: number;
  start_date: Date;
  value: number;
  investment?: IInvestment;

  constructor(user_investment: IUserInvestment) {
    this.id = user_investment.id;
    this.user_id = user_investment.user_id;
    this.investment_id = user_investment.investment_id;
    this.start_date = user_investment.start_date;
    this.value = user_investment.value;
  }

  async getInvestment(): Promise<Error | null> {
    const [investment, err] = await Investment.getInvestmentById(
      this.investment_id,
    );
    if (!investment) {
      return err;
    }
    this.investment = investment;
    return null;
  }

  static async createUserInvestment(
    user_id: number,
    investment_id: number,
    value: number,
  ): Promise<Error | null> {
    try {
      const start_date = new Date();

      await client.queryArray(
        `UPDATE users SET balance = balance - $VALUE WHERE id = $USER_ID`,
        { user_id, value },
      );

      await client.queryArray(
        `INSERT INTO user_investment (user_id, investment_id, start_date, value) 
          VALUES ($USER_ID, $INVESTMENT_ID, $START_DATE, $VALUE)`,
        { user_id, investment_id, start_date, value },
      );

      return null;
    } catch (error) {
      return error;
    }
  }

  async getReturn(): Promise<[number[] | null, Error | null]> {
    try {
      const id = this.id;
      const investment = this.investment;
      if (!investment) {
        return [null, new Error("Undefined investment")];
      }

      if (investment.fixed_income && investment.percentage) {
        const percentage = [investment.percentage];
        return [percentage, null];
      }

      const { rows } = await client.queryArray<[number]>(
        "SELECT percentage FROM investment_fluctuations WHERE user_investment_id = $ID",
        { id },
      );
      const percentages = rows.flat();

      return [percentages, null];
    } catch (error) {
      return [null, error];
    }
  }

  async recoverInvestment(): Promise<Error | null> {
    try {
      // remove mock when fluctuation functionality is complete
      const investment = this.investment;
      if (!investment) {
        return new Error("Undefined investment");
      }

      if (!investment.fixed_income) {
        await generateFluctuations(this.id);
      }

      const initial_value = this.value;

      const [returns, err] = await this.getReturn();
      if (err || !returns) {
        return err;
      }

      let value = initial_value;
      for (const percentage of returns) {
        const as_decimal = (percentage / 100) + 1;
        value *= as_decimal;
      }

      value = Math.floor(value);

      const user_id = this.user_id;
      await client.queryArray(
        `UPDATE users SET balance = balance + $VALUE WHERE id = $USER_ID`,
        { user_id, value },
      );

      const id = this.id;
      await client.queryArray(
        `UPDATE user_investment SET deleted = true WHERE id = $ID`,
        { id },
      );

      return null;
    } catch (err) {
      return err;
    }
  }

  static async getUserInvestment(
    id: number,
    user_id: number,
  ): Promise<[UserInvestment | null, Error | null]> {
    try {
      const { rows } = await client.queryObject<IUserInvestment>(
        "SELECT id, user_id, investment_id, start_date, value FROM user_investment WHERE id = $ID and deleted = false",
        { id },
      );

      if (rows.length == 0) {
        return [null, new Error("Investment not found")];
      }

      const investment = new UserInvestment(rows[0]);

      if (investment.user_id !== user_id) {
        return [null, new Error("Investment does not belong to this user")];
      }

      return [investment, null];
    } catch (error) {
      return [null, error];
    }
  }

  static async listUserInvestments(
    user_id: number,
  ): Promise<[IUserInvestment[] | null, Error | null]> {
    try {
      const { rows } = await client.queryObject<IUserInvestment>(
        "SELECT id, user_id, investment_id, start_date, value FROM user_investment WHERE user_id = $USER_ID and deleted = false",
        { user_id },
      );

      return [rows, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export default UserInvestment;
