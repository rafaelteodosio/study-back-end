import {
    ClientPostgreSQL,
    NessieConfig,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";

const client = new ClientPostgreSQL({
    database: "study-api",
    hostname: "localhost",
    port: 5432,
    user: "user",
    password: "password",
});

/** This is the final config object */
const config: NessieConfig = {
    client,
    migrationFolders: ["./db/migrations"],
    seedFolders: ["./db/seeds"],
};

export default config;
