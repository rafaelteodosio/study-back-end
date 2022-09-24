import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";

export const config = Deno.env.get("DATABASE_URL") ||
  "postgres://user:password@localhost:5432/study-api";

const client = new Client(config);

export default client;
