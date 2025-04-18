# koa-morgan-logs

This is an example repository that I used to understand how middlewares work. In this case, I want to create a logger than can log the response body.

```sh
# Install dependencies
yarn

# Run the server
node index.js

# Run the request
node request.js

# Result on the server
Sat, 12 Apr 2025 23:08:41 GMT {"userId":"123"} {"message":{"userId":"123"}}
```

Some findings:

## `morgan` internally uses `on-finished` package

This is pretty cool, so there's this line in the source code:

```js
if (immediate) {
  // immediate log
  logRequest();
} else {
  // record response start
  onHeaders(res, recordStartTime);

  // log when response finished
  onFinished(res, logRequest);
}
```

Which means, if we pass `options.immediate`, then `morgan` will log on request. If not, `morgan` will log on response.

## `await next()` is a thing

Previously, I thought the `await next()` is "just because". Turns out it can be used to "defer" middleware execution. For example, if `options.immediate = true`, then we want to place the logger after `await next()`, so all middlewares are executed first before the logger. This way, when the logger runs, it has the data it requires, such as response body and response status.

## `app.use()` expects the middleware function to return a Promise

It didn't register to me before, but upon reading the source code of `koa-morgan` https://github.com/koa-modules/morgan/blob/master/index.js#L29-L38 I realized that the middleware function _always_ expects a Promise to be returned in the function. That's why we need to have an async function to call the `await next()` as pointed in the point above.

Additionally, the `koa-morgan` code perhaps is not valid anymore for `morgan`. This is because, as we see from the [morgan source code](https://github.com/expressjs/morgan/blob/master/index.js#L133-L144), the `next` call, which is the 3rd parameter of the logger, apparently does not include any argument at all. So, the `error` will always be undefined.
