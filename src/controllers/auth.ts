import { type RouterContext } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { PostgresError } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import User from "../models/user.ts";
import { error, response } from "../utils/response.ts";

export const signup = async (ctx: RouterContext<"/signup">) => {
  const { nickname, email, password } =
    (await ctx.request.body({ type: "json" }).value);

  const err = await User.createUser(nickname, email, password);
  if (err) {
    if (!(err instanceof PostgresError)) {
      ctx.response.status = 500;
      ctx.response.body = error(err.message);
    }

    const unique_pattern =
      /duplicate key value violates unique constraint ".+_(.+)_.+"$/;
    const match = err.message.match(unique_pattern);

    if (!match) {
      ctx.response.status = 400;
      ctx.response.body = error("database insert error");
      return;
    }

    ctx.response.status = 400;
    ctx.response.body = error(`${match[1]} field must be unique`);

    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response();
};

export const login = async (ctx: RouterContext<"/login">) => {
  const { email, password } = (await ctx.request.body({ type: "json" }).value);

  ctx.response.status = 400;
  ctx.response.body = error("invalid credentials");

  const [user, err] = await User.getUserByEmail(email);
  if (!user) {
    if ((err instanceof PostgresError)) {
      ctx.response.status = 500;
      ctx.response.body = error("database error");
    }
    return;
  }

  const hash = user.password;
  if (!hash) {
    return;
  }

  const match = User.checkPassword(password, hash);

  if (!match) {
    return;
  }

  const token = await user.generateJWT();

  ctx.response.status = 200;
  ctx.response.body = response({ token });
};

export const authUser = (ctx: RouterContext<"/auth/user">) => {
  const user_output = ctx.state.user.output();
  ctx.response.status = 200;
  ctx.response.body = response({ user: user_output });
};
