import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(_info: Info): Promise<void> {
    const investments = `
    CREATE TABLE investments (
        id serial PRIMARY KEY,
        name varchar(255) UNIQUE,
        stars smallint not null,
        percentage numeric(5,2),
        fixed_income boolean not null
    )`;

    const user_investment = `
    CREATE TABLE user_investment (
        id serial PRIMARY KEY,
        user_id integer not null references users(id),
        investment_id integer not null references investments(id),
        start_date timestamp not null,
        value numeric(14,2) not null
    )`;

    const investment_fluctuations = `
    CREATE TABLE investment_fluctuations (
        id serial PRIMARY KEY,
        user_investment_id integer not null references user_investment(id),
        percentage numeric(5,2) not null
    )`;

    await this.client.queryArray(investments);
    await this.client.queryArray(user_investment);
    await this.client.queryArray(investment_fluctuations);
  }

  /** Runs on rollback */
  async down(_info: Info): Promise<void> {
    await this.client.queryArray("DROP TABLE investment_fluctuations");
    await this.client.queryArray("DROP TABLE user_investment");
    await this.client.queryArray("DROP TABLE investments");
  }
}
