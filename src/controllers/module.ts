import {
  helpers,
  type RouterContext,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import Module from "../models/module.ts";
import { error, response } from "../utils/response.ts";

export const listModules = async (
  ctx: RouterContext<"/module">,
): Promise<void> => {
  const [modules, err] = await Module.listModules();
  if (!modules) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = 500;
    ctx.response.body = error(error_message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response({ modules });
};

export const getModule = async (
  ctx: RouterContext<"/module/:id">,
): Promise<void> => {
  const { id } = await helpers.getQuery(ctx, { mergeParams: true });

  const parsed_id = Number(id);
  if (isNaN(parsed_id)) {
    ctx.response.status = 400;
    ctx.response.body = error("Id must be a number");
    return;
  }

  const [module, err] = await Module.getModuleById(parsed_id);
  if (!module) {
    const error_message = err?.message || "Something went wrong";
    ctx.response.status = error_message === "Module not found" ? 404 : 500;
    ctx.response.body = error(error_message);
    return;
  }

  const err2 = await module.getQuests();
  if (err2) {
    ctx.response.status = 500;
    ctx.response.body = error(err2.message);
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = response({ module });
};
