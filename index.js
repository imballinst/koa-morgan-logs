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

const logger = morgan((tokens, req, res) => {
  return [
    new Date().toISOString(),
    tokens.requestBody(req, res),
    tokens.responseBody(req, res),
  ].join(" ");
});

app.use(bodyParser());

app.use(async (ctx, next) => {
  return new Promise((resolve, reject) => {
    logger(ctx.request, ctx.response, (err) => {
      if (err) reject(err);

      resolve(ctx);
    });
  }).then(next);
});

router.post("/", (ctx) => {
  ctx.status = 200;
  ctx.body = { message: ctx.request.body };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
