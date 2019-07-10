const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path');
const router = jsonServer.router(path.join(__dirname,'db.json'));
const middlewares = jsonServer.defaults({static: 'node_modules/json-server/dist'})

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

server.use(jsonServer.rewriter({
  "/user/login": "/login",
  "/transaction/all": "/transaction"
}))

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req,res,next) => {
  if (req.originalUrl === '/user/login/' && req.method === 'POST') {
    // Converts POST to GET
    req.method = 'GET';
  }
  next();
})

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

server.use(router)
server.listen(8000, () => {
  console.log('JSON Server is running at http:localhost:8000')
})