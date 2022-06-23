import { type RouterContext } from "https://deno.land/x/oak@v10.6.0/mod.ts";

export const signup = (ctx: RouterContext<"/signup">) => {
  ctx.response.body = { response: "hello world" };
};
