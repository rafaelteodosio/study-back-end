import {
  helpers,
  type RouterContext,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import Quest from "../models/quest.ts";
import { error, response } from "../utils/response.ts";

export const listQuests = async (
  ctx: RouterContext<"/quest">,
): Promise<void> => {
  const [quests, err] = await Quest.listQuests();
  if (!quests) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = 500;
    ctx.response.body = error(error_message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response({ quests });
};

export const getQuest = async (
  ctx: RouterContext<"/quest/:id">,
): Promise<void> => {
  const { id } = await helpers.getQuery(ctx, { mergeParams: true });

  const parsed_id = Number(id);
  if (isNaN(parsed_id)) {
    ctx.response.status = 400;
    ctx.response.body = error("Id must be a number");
    return;
  }

  const [quest, err] = await Quest.getQuestById(parsed_id);
  if (!quest) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = error_message === "Quest not found" ? 404 : 500;
    ctx.response.body = error(error_message);
    return;
  }

  const err2 = await quest.getQuestions();
  if (err2) {
    ctx.response.status = 500;
    ctx.response.body = error(err2.message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response({ quest });
};
