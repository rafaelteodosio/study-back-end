import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(_info: Info): Promise<void> {
    const add_column =
      `ALTER TABLE users ADD COLUMN first_access boolean DEFAULT true;`;

    await this.client.queryArray(add_column);
  }

  /** Runs on rollback */
  async down(_info: Info): Promise<void> {
    const drop_column = `ALTER TABLE users DROP COLUMN first_access;`;

    await this.client.queryArray(drop_column);
  }
}
