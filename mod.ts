import { log, Application, oakCors } from "./deps.ts";

import { PORT, HOST } from "./config/config.ts";

import apiRoutes from "./routes/api.ts";
import isAdmin from "./middlewares/isAdminMiddleware.ts";
import isToken from "./middlewares/isToken.ts";

const app = new Application();
app.use(
  oakCors({
    // origin: /^.+localhost:(4200)$/,
    origin: [/^.+localhost:(4200)$/],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
  },
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"],
    },
  },
});

app.addEventListener("error", (event) => {
  log.error(event.error);
});

// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.response.body = "Internal Server Error";
    throw error;
  }
});

app.use(apiRoutes.routes());
app.use(apiRoutes.allowedMethods());

app.use((ctx) => {
  ctx.response.body = "Not found!!";
});

app.use(isAdmin);
app.use(isToken);

if (import.meta.main) {
  log.info(`Starting server on port ${PORT}...`);
  await app.listen(`${HOST}:${PORT}`);
}
