import { Context, decode } from "../deps.ts";

import getUser from "../services/getUser.ts";
import getAllUsers from "../services/getAllUsers.ts";

const isAdmin = async ({ request, response, cookies }: Context, next: any) => {
  const esbApitoken: any = cookies.get("esbApitoken");
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("sumtauth-header", esbApitoken);

  const [payload, signature, header]: any = await decode(esbApitoken);
  const requestUser = signature.sub;
  try {
    const user: any = await getUser(requestUser);
    if (!user?.isAdmin) {
      response.status = 401;
      response.body = {
        success: false,
        message: "Unauthorized",
      };
      return;
    }
  } catch (err) {
    console.log(err);
  }
  await next();
};

export default isAdmin;
