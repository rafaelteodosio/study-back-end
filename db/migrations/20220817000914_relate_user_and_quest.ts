import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(_info: Info): Promise<void> {
    const create_module = `
        CREATE TABLE user_quest (
            id serial PRIMARY KEY,
            user_id integer not null references users(id),
            quest_id integer not null references quest(id),
            ratio numeric(4, 3)
        )`;
    await this.client.queryArray(create_module);
  }

  /** Runs on rollback */
  async down(_info: Info): Promise<void> {
    await this.client.queryArray("DROP TABLE user_quest");
  }
}
