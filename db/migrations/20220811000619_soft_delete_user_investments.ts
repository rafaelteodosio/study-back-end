import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(_info: Info): Promise<void> {
    await this.client.queryArray(
      "ALTER TABLE user_investment ALTER COLUMN value TYPE integer;",
    );
    await this.client.queryArray(
      "ALTER TABLE user_investment ADD deleted boolean default false;",
    );
  }

  /** Runs on rollback */
  async down(_info: Info): Promise<void> {
    await this.client.queryArray(
      "ALTER TABLE user_investment ALTER COLUMN value TYPE numeric(14,2);",
    );
    await this.client.queryArray(
      "ALTER TABLE user_investment DROP COLUMN deleted;",
    );
  }
}
