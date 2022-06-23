import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { signup } from "./controllers/auth.ts";

const router = new Router();

router.post("/signup", signup);

export default router;
