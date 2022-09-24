import {
  ClientPostgreSQL,
  NessieConfig,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

import { config as conf } from "./src/db.ts";

const client = new ClientPostgreSQL(conf);

/** This is the final config object */
const config: NessieConfig = {
  client,
  migrationFolders: ["./db/migrations"],
  seedFolders: ["./db/seeds"],
};

export default config;
