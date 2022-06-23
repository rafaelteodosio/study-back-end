import { Application } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import client from "./src/db.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello world!";
});
await client.connect();
await app.listen({ port: 5000 });
