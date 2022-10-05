import { compileCode } from "@nx-js/compiler-util";

export type Context = Record<any, any>;

export function compile(src: string, context: Context) {
  const exec = compileCode(src);

  return async (temporary?: Context) => {
    return await exec(context, temporary);
  };
}
