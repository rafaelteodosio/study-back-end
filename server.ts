import { Application } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import client from "./src/db.ts";
import router from "./src/routes.ts";

const app = new Application();
const port = Number(Deno.env.get("PORT") || "5000");

app.use(router.routes());

await client.connect();
await app.listen({ port });
