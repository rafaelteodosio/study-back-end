import { Context } from "https://deno.land/x/oak@v10.6.0/mod.ts";
import User from "../models/user.ts";
import { error } from "../utils/response.ts";

const authorization = async (ctx: Context, next: () => Promise<unknown>) => {
  const token: string | null = ctx.request.headers.get("Authorization");
  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = error("token not provided");
    return;
  }

  const [user, err] = await User.validateJWT(token);
  if (!user) {
    ctx.response.status = 401;
    ctx.response.body = error(err ? err.message : "invalid jwt");
    return;
  }

  ctx.state.user = user;
  await next();
};

export default authorization;
