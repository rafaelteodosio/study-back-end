import {
  AbstractSeed,
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractSeed<ClientPostgreSQL> {
  /** Runs on seed */
  async run(_info: Info): Promise<void> {
    await this.client.queryArray(
      `INSERT INTO investments (id, name, stars, percentage, fixed_income)
             VALUES 
                  (1, 'CDB 10% a.a.','3', '10', true),
                  (2, 'AAA3','2', null, false)`,
    );
  }
}
