import client from "../db.ts";

export interface IInvestment {
  id: number;
  name: string;
  stars: number;
  fixed_income: boolean;
  percentage?: number;
}

class Investment implements IInvestment {
  id: number;
  name: string;
  stars: number;
  fixed_income: boolean;
  percentage?: number;

  constructor(investment: IInvestment) {
    this.id = investment.id;
    this.name = investment.name;
    this.stars = investment.stars;
    this.fixed_income = investment.fixed_income;
    this.percentage = investment.percentage;
  }

  static async getInvestmentById(
    id: number,
  ): Promise<[Investment | null, Error | null]> {
    try {
      const { rows } = await client.queryObject<IInvestment>(
        "SELECT  id, name, stars, fixed_income, percentage FROM investments WHERE id = $ID",
        { id },
      );

      if (rows.length == 0) {
        return [null, new Error("Investment not found")];
      }

      const investment = new Investment(rows[0]);

      return [investment, null];
    } catch (error) {
      return [null, error];
    }
  }

  static async listInvestments(): Promise<
    [IInvestment[] | null, Error | null]
  > {
    try {
      const { rows } = await client.queryObject<IInvestment>(
        "SELECT id, name, stars, fixed_income, percentage FROM investments",
      );

      return [rows, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export default Investment;
