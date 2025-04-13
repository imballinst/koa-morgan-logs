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

app.use(bodyParser());

const logger = morgan(":date :requestBody :responseBody");

app.use((ctx, next) => {
  return new Promise((resolve) => {
    logger(ctx.request, ctx.response, resolve);
  }).then(next);
});

router.post("/", (ctx) => {
  ctx.status = 200;
  ctx.body = { message: ctx.request.body };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
