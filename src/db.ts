import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";


const config = 'postgres://user:password@localhost:5432/study-api'

const client = new Client(config);

export default client;
