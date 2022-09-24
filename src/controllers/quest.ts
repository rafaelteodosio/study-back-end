import {
  helpers,
  type RouterContext,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import Quest from "../models/quest.ts";
import { error, response } from "../utils/response.ts";
import type User from "../models/user.ts";

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

export const completeQuest = async (
  ctx: RouterContext<"/quest/:id/complete">,
) => {
  const body = ctx.request.body({ type: "json" });
  const { answers } = await body.value;

  const parsed_answers = Number(answers);
  if (isNaN(parsed_answers)) {
    ctx.response.status = 400;
    ctx.response.body = error('"Right answers" must be a number');
    return;
  }

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

  const user: User = ctx.state.user.output();

  const err3 = await quest.completeQuest(user, parsed_answers);
  if (err3) {
    ctx.response.status = 500;
    ctx.response.body = error(err3.message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response(null);
};

export const listCompleteQuests = async (
  ctx: RouterContext<"/quest/complete">,
) => {
  const user: User = ctx.state.user.output();
  const [quests, err] = await Quest.listCompleteQuests(user);
  if (!quests) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = 500;
    ctx.response.body = error(error_message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response({ quests });
};
