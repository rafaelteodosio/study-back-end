import {
  helpers,
  type RouterContext,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import Question from "../models/question.ts";
import { error, response } from "../utils/response.ts";

export const listQuestions = async (
  ctx: RouterContext<"/question">,
): Promise<void> => {
  const [questions, err] = await Question.listQuestions();
  if (!questions) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = 500;
    ctx.response.body = error(error_message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response({ questions });
};

export const getQuestion = async (
  ctx: RouterContext<"/question/:id">,
): Promise<void> => {
  const { id } = await helpers.getQuery(ctx, { mergeParams: true });

  const parsed_id = Number(id);
  if (isNaN(parsed_id)) {
    ctx.response.status = 400;
    ctx.response.body = error("Id must be a number");
    return;
  }

  const [question, err] = await Question.getQuestionById(parsed_id);
  if (!question) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = error_message === "Question not found" ? 404 : 500;
    ctx.response.body = error(error_message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response({ question });
};
