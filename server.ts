import { Application } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import client from "./src/db.ts";
import router from "./src/routes.ts";

const app = new Application();

app.use(router.routes());

await client.connect();
await app.listen({ port: 5000 });
