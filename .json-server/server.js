const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path');
const router = jsonServer.router(path.join(__dirname,'db.json'));
const middlewares = jsonServer.defaults({static: 'node_modules/json-server/dist'})

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Custom routes:
server.use(jsonServer.rewriter({
  "/user/login": "/login",
  "/transaction/all": "/transaction"
}))

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
// Modify method from POST to GET so json-server behaves as the true backend.
server.use((req,res,next) => {
  if (req.originalUrl === '/user/login/' && req.method === 'POST') {
    // Converts POST to GET
    req.method = 'GET';
  }
  next();
})

// Customize the response to /transaction/all to comply with API specs.
// See: https://app.swaggerhub.com/apis/kw-liquidator/Liquidator/1.0.0#/recurring/addRecurringTransaction
router.render = (req, res) => {
  if (req.originalUrl === '/transaction/all' && req.method === 'GET') {
    res.jsonp({
      pagination: null,
      transactions: res.locals.data
    });
  } else {
    res.jsonp(res.locals.data)
  }
}

// Use the json-server router with the custom render above. Run the server on port 8000.
server.use(router)
server.listen(8000, () => {
  console.log('JSON Server is running at http:localhost:8000')
})