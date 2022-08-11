import {
  helpers,
  type RouterContext,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import Investment from "../models/investment.ts";
import { error, response } from "../utils/response.ts";

export const listInvestments = async (
  ctx: RouterContext<"/investment">,
): Promise<void> => {
  const [investments, err] = await Investment.listInvestments();
  if (!investments) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = 500;
    ctx.response.body = error(error_message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response({ investments });
};

export const getInvestment = async (
  ctx: RouterContext<"/investment/:id">,
): Promise<void> => {
  const { id } = await helpers.getQuery(ctx, { mergeParams: true });

  const parsed_id = Number(id);
  if (isNaN(parsed_id)) {
    ctx.response.status = 400;
    ctx.response.body = error("Id must be a number");
    return;
  }

  const [investment, err] = await Investment.getInvestmentById(parsed_id);
  if (!investment) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = error_message === "Investment not found" ? 404 : 500;
    ctx.response.body = error(error_message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response({ investment });
};
