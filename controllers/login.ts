import { puppeteer, Context, decode, verify } from "../deps.ts";

import getUser from "../services/getUser.ts";
import getAllUsers from "../services/getAllUsers.ts";
import addUser from "../services/addUser.ts";
import addActiveUser from "../services/addActiveUser.ts";
import deleteUser from "../services/deleteUser.ts";
import updateUser from "../services/updateUser.ts";
import { User } from "../interfaces/User.ts";

export default {
  login: async ({ request, response, cookies }: Context) => {
    const url2 =
      "https://samsung.sumtotal.host/Broker/Account/Login.aspx?wtrealm=https%3a%2f%2fsamsung.sumtotal.host%2fcore%2f&ReturnUrl=http%3a%2f%2fsamsung.sumtotal.host%2fBroker%2fToken%2fSaml11.ashx%3fwa%3dwsignin1.0%26wtrealm%3dhttps%253a%252f%252fsamsung.sumtotal.host%252fcore%252f%26wreply%3dhttp%253a%252f%252fsamsung.sumtotal.host%252fcore%252f&IsHybridOrNativeClient=False&domainid=52160A28FC58BBBE7D714E075077AC76";
    const usernameInput =
      "#BodyContent_MainContent_MainContentPlaceHolder_UserName";
    const passwordInput =
      "#BodyContent_MainContent_MainContentPlaceHolder_Password";
    const loginButton =
      "#BodyContent_MainContent_MainContentPlaceHolder_LoginButton";
    const body = await request.body();

    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }
    const { username, password } = await body.value;

    try {
      const browser = await puppeteer.launch({
        product: "chrome",
      });
      const page = await browser.newPage();

      await page.goto(url2, { waitUntil: "networkidle0" });

      await page.type(usernameInput, username);
      await page.type(passwordInput, password);
      await page.click(loginButton);
      await page.waitForNavigation({ waitUntil: "networkidle0" });

      if (page.url() === url2) {
        response.status = 401;
        response.body = {
          success: false,
          message: "Invalid",
        };
      } else {
        // check if user is in db
        const user: User | null = await getUser(username);
        if (!user?.username) {
          response.status = 404;
          response.body = {
            success: false,
            message: "The user does not exist in the db",
          };
        } else {
          if (user.status === "waiting") {
            response.status = 401;
            response.body = {
              success: false,
              message: "waiting",
            };
          } else if (user.status === "blocked") {
            response.status = 401;
            response.body = {
              success: false,
              message: "blocked",
            };
          } else {
            await page.goto(
              "https://samsung.sumtotal.host/core/socialcommunities",
              {
                waitUntil: "networkidle0",
              }
            );

            await page.waitForSelector(".card_container_padding", {
              visible: true,
              timeout: 0,
            });

            const apiToken = JSON.parse(
              await page.evaluate(() =>
                JSON.stringify(
                  (window as any).staticData.apiPaths.search.esbApiToken
                )
              )
            );

            let expirationDate = new Date(new Date().getTime() + 86400000);
            cookies.set("esbApitoken", apiToken, {
              httpOnly: false,
              expires: expirationDate,
            });

            response.status = 200;
            response.body = {
              success: true,
              message: "success",
              isAdmin: user.isAdmin,
            };
          }
        }
      }
      await browser.close();
    } catch (err) {
      console.log(err);
      // await browser.close();
    }
  },
  communities: async ({ request, response, cookies }: Context) => {
    const url =
      "https://samsung.sumtotal.host/Services/api/sumtSocial/communities?pageNum=1&pageSize=8";

    const esbApitoken: any = cookies.get("esbApitoken");
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("sumtauth-header", esbApitoken);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: requestHeaders,
      });

      if (!res.ok) {
        response.status = 401;
        response.body = {
          success: false,
          message: "Unauthorized",
        };
      } else {
        const data = await res.json();
        response.status = 200;
        response.body = {
          success: true,
          data,
        };
      }
    } catch (error) {
      console.log(error);
    }
  },
  discussions: async ({ request, response, cookies }: Context) => {
    const communityId = await request.url.searchParams.get("communityId");
    const discussionsCount = await request.url.searchParams.get(
      "discussionsCount"
    );

    if (!communityId || !discussionsCount) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No query provided",
      };
      return;
    }

    const url = `https://samsung.sumtotal.host/Services/api/social/discussions?pageNum=1&pageSize=${discussionsCount}&communityId=${communityId}`;
    const esbApitoken: any = cookies.get("esbApitoken");
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("sumtauth-header", esbApitoken);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: requestHeaders,
      });

      if (!res.ok) {
        response.status = 401;
        response.body = {
          success: false,
          message: "Unauthorized",
        };
      } else {
        const data = await res.json();
        response.status = 200;
        response.body = {
          success: true,
          data,
        };
      }
    } catch (error) {
      console.log(error);
    }
  },
  blog: async ({ request, response, cookies }: Context) => {
    const communityId = await request.url.searchParams.get("communityId");
    const blogCount = await request.url.searchParams.get("blogCount");

    if (!communityId || !blogCount) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No query provided",
      };
      return;
    }

    const urlBlog = `https://samsung.sumtotal.host/Services/api/social/communities/${communityId}/blogs?pageNum=1&pageSize=${blogCount}`;
    const esbApitoken: any = cookies.get("esbApitoken");
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("sumtauth-header", esbApitoken);

    try {
      const res = await fetch(urlBlog, {
        method: "GET",
        headers: requestHeaders,
      });

      if (!res.ok) {
        response.status = 401;
        response.body = {
          success: false,
          message: "Unauthorized",
        };
      } else {
        const data = await res.json();
        response.status = 200;
        response.body = {
          success: true,
          data,
        };
      }
    } catch (error) {
      console.log(error);
    }
  },
  signupRequest: async ({ request, response }: Context) => {
    const body = await request.body();

    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }
    const { username } = await body.value;

    try {
      const user = await addUser(username);

      if (!user?.username) {
        response.status = 409;
        response.body = {
          success: false,
          message: "Error creating the request!",
        };
        return;
      }

      response.status = 200;
      response.body = {
        success: true,
        data: user,
      };
    } catch (error) {
      console.log(error);
    }
  },
  getUsers: async ({ request, response, cookies }: Context) => {
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

    const [payload, signature, header]: any = await decode(esbApitoken);
    const requestUser = signature.sub;
    try {
      const user = await getUser(requestUser);
      if (!user?.isAdmin) {
        response.status = 401;
        response.body = {
          success: false,
          message: "Unauthorized",
        };
      } else {
        const users = await getAllUsers();
        response.status = 200;
        response.body = {
          success: true,
          data: users,
        };
      }
    } catch (err) {
      console.log(err);
    }
  },
  addUser: async ({ request, response }: Context) => {
    const body = await request.body();

    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }

    const { username } = await body.value;
    try {
      const user = await addActiveUser(username);

      if (!user?.username) {
        response.status = 409;
        response.body = {
          success: false,
          message: "Error creating the user!",
        };
        return;
      }

      response.status = 200;
      response.body = {
        success: true,
        data: user,
      };
    } catch (err) {
      console.log(err);
    }
  },
  deleteUser: async ({ request, response }: Context) => {
    const body = await request.body();

    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }

    const { username, status } = await body.value;
    try {
      const user = await deleteUser(username);

      if (!user?.username) {
        response.status = 409;
        response.body = {
          success: false,
          message: "Error deleting the user!",
        };
        return;
      }

      response.status = 200;
      response.body = {
        success: true,
        data: user,
      };
    } catch (err) {
      console.log(err);
    }
  },
  updateUser: async ({ request, response }: Context) => {
    const body = await request.body();

    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No data provided",
      };
      return;
    }

    const { username, status } = await body.value;
    try {
      const user = await updateUser(username, status);
      if (user?.matchedCount === 0) {
        response.status = 409;
        response.body = {
          success: false,
          message: "Error updating the user!",
        };
        return;
      }

      response.status = 200;
      response.body = {
        success: true,
        data: user,
      };
    } catch (err) {
      console.log(err);
    }
  },
  isAdmin: async ({ request, response }: Context) => {
    response.status = 200;
    response.body = {
      success: true,
      message: "success",
      isAdmin: true,
    };
  },
};
