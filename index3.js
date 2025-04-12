const Koa = require("koa");
const { bodyParser } = require("@koa/bodyparser");
const Router = require("@koa/router");
const morgan = require("morgan");

const app = new Koa();
const router = new Router();

morgan.token("requestBody", (req) => {
  return JSON.stringify(req.body);
});

morgan.token("responseBody", (_, res) => {
  return JSON.stringify(res.body);
});

const logger = morgan(
  (tokens, req, res) => {
    return [
      new Date().toISOString(),
      tokens.requestBody(req, res),
      tokens.responseBody(req, res),
    ].join(" ");
  },
  {
    // Will immediately log on request instead of log on response.
    // By default this is `false`, `morgan` internally uses `onFinished` from `on-finished` package
    // to determine if all handlers have been finished or not.
    //
    // If this is `true`, then the logger has to be placed after `await next()`.
    immediate: true,
  }
);

app.use(bodyParser());

app.use(async (ctx, next) => {
  await next();

  // Swap position to above `next` call if `immediate: false`.
  logger(ctx.request, ctx.response, () => {});
});

router.post("/", (ctx) => {
  ctx.status = 200;
  ctx.body = { message: ctx.request.body };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
