import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(_info: Info): Promise<void> {
    const statement = `
    CREATE TABLE users (
        id serial PRIMARY KEY,
        nickname varchar(255) UNIQUE,
        email varchar(255) UNIQUE,
        password varchar
    )`;

    await this.client.queryArray(statement);
  }

  /** Runs on rollback */
  async down(_info: Info): Promise<void> {
    await this.client.queryArray("DROP TABLE users");
  }
}
