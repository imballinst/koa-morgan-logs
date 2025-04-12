const Koa = require("koa");
const { bodyParser } = require("@koa/bodyparser");

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
  console.log("hello", ctx.request.body, ctx.body);
  await next();
  console.log("hello", ctx.request.body, ctx.body);
});

app.use((ctx) => {
  ctx.status = 200;
  ctx.body = { message: ctx.request.body };
});

app.listen(3000);
