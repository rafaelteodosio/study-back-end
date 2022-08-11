import {
  helpers,
  type RouterContext,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import User from "../models/user.ts";
import UserInvestment from "../models/userInvestment.ts";
import { error, response } from "../utils/response.ts";

export const makeInvestment = async (
  ctx: RouterContext<"/user/investment">,
) => {
  const body = ctx.request.body({ type: "json" });

  interface Input {
    investment_id: number;
    value: number;
  }

  const { investment_id, value }: Input = await body.value;

  if (isNaN(investment_id)) {
    ctx.response.status = 400;
    ctx.response.body = error("investment_id must be a number");
    return;
  }

  if (isNaN(value)) {
    ctx.response.status = 400;
    ctx.response.body = error("value must be a number");
    return;
  }

  const user: User = ctx.state.user.output();
  const err = await user.makeInvestment(investment_id, value);
  if (err) {
    if (err.message.includes("violates foreign key constraint")) {
      ctx.response.status = 400;
      ctx.response.body = error("Investment not found");
      return;
    }
    ctx.response.status = 500;
    ctx.response.body = error("Something went wrong");
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response();
};

export const listUserInvestments = async (
  ctx: RouterContext<"/user/:id/investment">,
) => {
  const { id } = await helpers.getQuery(ctx, {
    mergeParams: true,
  });

  const user_id = Number(id);

  if (isNaN(user_id)) {
    ctx.response.status = 400;
    ctx.response.body = error("id must be a number");
    return;
  }

  const [investments, err] = await UserInvestment.listUserInvestments(user_id);
  if (!investments) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = 500;
    ctx.response.body = error(error_message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response({ investments });
};

export const getUserInvestment = async (
  ctx: RouterContext<"/user/investment/:id">,
) => {
  const { id } = await helpers.getQuery(ctx, {
    mergeParams: true,
  });

  const investment_id = Number(id);

  if (isNaN(investment_id)) {
    ctx.response.status = 400;
    ctx.response.body = error("id must be a number");
    return;
  }

  const user: User = ctx.state.user.output();

  const [investment, err] = await UserInvestment.getUserInvestment(
    investment_id,
    user.id,
  );

  if (!investment) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = error_message.includes("does not belong") ? 403 : 500;
    ctx.response.status = error_message.includes("not found") ? 404 : 500;
    ctx.response.body = error(error_message);
    return;
  }

  const err2 = await investment.getInvestment();
  if (err2) {
    ctx.response.status = 500;
    ctx.response.body = error(err2.message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response({ investment });
};

export const recoverInvestment = async (
  ctx: RouterContext<"/user/investment/:id">,
) => {
  const { id } = await helpers.getQuery(ctx, {
    mergeParams: true,
  });

  const investment_id = Number(id);

  if (isNaN(investment_id)) {
    ctx.response.status = 400;
    ctx.response.body = error("id must be a number");
    return;
  }

  const user: User = ctx.state.user.output();

  const [investment, err] = await UserInvestment.getUserInvestment(
    investment_id,
    user.id,
  );

  if (!investment) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = error_message.includes("does not belong") ? 403 : 500;
    ctx.response.status = error_message.includes("not found") ? 404 : 500;
    ctx.response.body = error(error_message);
    return;
  }

  const err2 = await investment.getInvestment();
  if (err2) {
    ctx.response.status = 500;
    ctx.response.body = error(err2.message);
    return;
  }

  const err3 = await investment.recoverInvestment();
  if (err3) {
    ctx.response.status = 500;
    ctx.response.body = error(err3.message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response();
};
