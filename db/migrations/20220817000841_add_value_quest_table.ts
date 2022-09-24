import {
  AbstractMigration,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
  /** Runs on migrate */
  async up(_info: Info): Promise<void> {
    await this.client.queryArray(
      "ALTER TABLE quest ADD reward integer;",
    );
  }

  /** Runs on rollback */
  async down(_info: Info): Promise<void> {
    await this.client.queryArray("ALTER TABLE quest DROP COLUMN reward;");
  }
}
