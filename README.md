# koa-morgan-logs

This is an example repository that I used to understand how middlewares work. In this case, I want to create a logger than can log the response body. Some findings:

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
