import { Router } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { authUser, login, setAccess, signup } from "./controllers/auth.ts";
import { getModule, listModules } from "./controllers/module.ts";
import {
  completeQuest,
  getQuest,
  listCompleteQuests,
  listQuests,
} from "./controllers/quest.ts";
import { getQuestion, listQuestions } from "./controllers/question.ts";
import { getInvestment, listInvestments } from "./controllers/investment.ts";
import {
  getUserInvestment,
  listUserInvestments,
  makeInvestment,
  recoverInvestment,
} from "./controllers/user.ts";
import authMiddleware from "./middleware/authMiddleware.ts";

const router = new Router();

router.post("/signup", signup);
router.post("/login", login);

router.use(authMiddleware);
router.get("/auth/user", authUser);
router.put("/auth/user/access", setAccess);

router.get("/module", listModules);
router.get("/module/:id", getModule);

router.get("/quest", listQuests);
router.get("/quest/complete", listCompleteQuests);
router.get("/quest/:id", getQuest);
router.put("/quest/:id/complete", completeQuest);

router.get("/question", listQuestions);
router.get("/question/:id", getQuestion);

router.get("/investment", listInvestments);
router.get("/investment/:id", getInvestment);

router.post("/user/investment", makeInvestment);
router.get("/user/:id/investment", listUserInvestments);
router.get("/user/investment/:id", getUserInvestment);
router.delete("/user/investment/:id", recoverInvestment);

export default router;
