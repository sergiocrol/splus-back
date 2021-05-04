import { Context } from "../deps.ts";

const isToken = async ({ request, response, cookies }: Context, next: any) => {
  const esbApitoken: any = cookies.get("esbApitoken");
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("sumtauth-header", esbApitoken);

  if (!esbApitoken) {
    response.status = 401;
    response.body = {
      success: false,
      message: "No valid token",
    };
    return;
  }

  await next();
};

export default isToken;
