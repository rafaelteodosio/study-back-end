import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { authUser, login, signup } from "./controllers/auth.ts";
import { getModule, listModules } from "./controllers/module.ts";
import { getQuest, listQuests } from "./controllers/quest.ts";
import { getQuestion, listQuestions } from "./controllers/question.ts";
import authMiddleware from "./middleware/authMiddleware.ts";

const router = new Router();

router.post("/signup", signup);
router.post("/login", login);

router.use(authMiddleware);
router.get("/auth/user", authUser);

router.get("/module", listModules);
router.get("/module/:id", getModule);

router.get("/quest", listQuests);
router.get("/quest/:id", getQuest);

router.get("/question", listQuestions);
router.get("/question/:id", getQuestion);

export default router;
